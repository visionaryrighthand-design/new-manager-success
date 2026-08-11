import { findRep, module01 } from '@promoted/content';
import { addCalendarDays, toCalendarDate } from '../time/business-days.js';
/**
 * XP awards.
 *
 * Deliberately weighted towards *judgment* over *recall*: a Curveball answered
 * well is worth more than a quiz question answered correctly, and a Field Note
 * — which cannot be marked right or wrong at all — is worth more than either.
 * If XP rewarded recall most, we would be building a trivia app.
 *
 * Note that a `costly` Curveball choice still earns XP. Getting a hard call
 * wrong in an app and reading why is exactly the behaviour we want; charging
 * the learner for it teaches them to avoid the hard ones.
 */
export const XP = {
    repCompleted: 50,
    quizQuestionCorrect: 10,
    quizPassed: 40,
    curveball: { best: 25, workable: 15, costly: 10 },
    fieldNoteSaved: 30,
    moduleCompleted: 250,
};
/** Ms in a day. Streaks are calendar-day based, not business-day based. */
const MS_PER_DAY = 86_400_000;
export function emptyProgress(enrollmentId, startedAt) {
    return {
        enrollmentId,
        startedAt,
        reps: {},
        xp: 0,
        streak: { current: 0, longest: 0, activeToday: false, atRisk: false },
        activeDates: [],
    };
}
function ensureRep(progress, repId) {
    const existing = progress.reps[repId];
    if (existing)
        return existing;
    const created = { repId, attempts: [], curveballVerdicts: {} };
    progress.reps[repId] = created;
    return created;
}
/**
 * Folds one activity event into a learner's progress.
 *
 * Pure: returns a new object and does not mutate the input. Events are
 * expected in chronological order; out-of-order events are still applied
 * safely but `streak` is only correct once all events up to `now` are in.
 */
export function applyActivity(progress, event, options = {}) {
    const tz = options.timeZone ?? 'UTC';
    const next = {
        ...progress,
        reps: { ...progress.reps },
        activeDates: [...progress.activeDates],
    };
    const date = toCalendarDate(event.at, tz);
    if (!next.activeDates.includes(date)) {
        next.activeDates = [...next.activeDates, date].sort();
    }
    if (event.repId) {
        const rep = { ...ensureRep(next, event.repId) };
        rep.curveballVerdicts = { ...rep.curveballVerdicts };
        next.reps[event.repId] = rep;
        switch (event.type) {
            case 'rep-opened':
                rep.openedAt ??= event.at;
                break;
            case 'field-note-saved':
                if (!rep.fieldNoteSavedAt) {
                    rep.fieldNoteSavedAt = event.at;
                    next.xp += XP.fieldNoteSaved;
                }
                break;
            case 'curveball-answered':
                if (event.targetId && event.verdict && !(event.targetId in rep.curveballVerdicts)) {
                    rep.curveballVerdicts[event.targetId] = event.verdict;
                    next.xp += XP.curveball[event.verdict];
                }
                break;
            case 'rep-completed':
                if (!rep.completedAt) {
                    rep.completedAt = event.at;
                    next.xp += XP.repCompleted;
                }
                break;
            default:
                break;
        }
    }
    if (event.type === 'module-completed')
        next.xp += XP.moduleCompleted;
    next.streak = computeStreak(next.activeDates, event.at, tz);
    return next;
}
/**
 * Records a quiz attempt and returns updated progress.
 *
 * Retakes are unlimited (the course outline specifies unlimited retakes for
 * both exams, so Rep quizzes follow suit). XP for correct answers is awarded
 * on the *first* attempt only — otherwise the optimal strategy is to fail
 * repeatedly and farm the retry.
 */
export function recordQuizAttempt(progress, repId, answers, at, options = {}) {
    const rep = findRep(repId);
    if (!rep)
        throw new Error(`Unknown rep: ${repId}`);
    const passingScore = options.passingScore ?? module01.passingScore;
    let correctCount = 0;
    for (const question of rep.quiz) {
        const given = answers.find((a) => a.questionId === question.id);
        const chosen = question.options.find((o) => o.id === given?.optionId);
        if (chosen?.correct)
            correctCount += 1;
    }
    const questionCount = rep.quiz.length;
    const score = questionCount === 0 ? 0 : Math.round((correctCount / questionCount) * 100);
    const attempt = {
        repId,
        at,
        score,
        correctCount,
        questionCount,
        passed: score >= passingScore,
    };
    const next = { ...progress, reps: { ...progress.reps } };
    const repProgress = { ...ensureRep(next, repId) };
    const isFirstAttempt = repProgress.attempts.length === 0;
    repProgress.attempts = [...repProgress.attempts, attempt];
    repProgress.bestScore = Math.max(repProgress.bestScore ?? 0, score);
    next.reps[repId] = repProgress;
    if (isFirstAttempt) {
        next.xp += correctCount * XP.quizQuestionCorrect;
        if (attempt.passed)
            next.xp += XP.quizPassed;
    }
    next.activeDates = [...progress.activeDates];
    const date = toCalendarDate(at, options.timeZone ?? 'UTC');
    if (!next.activeDates.includes(date))
        next.activeDates = [...next.activeDates, date].sort();
    next.streak = computeStreak(next.activeDates, at, options.timeZone ?? 'UTC');
    return { progress: next, attempt };
}
/**
 * Streak = consecutive calendar days with at least one activity.
 *
 * Counting ends at today if the learner has been active today, otherwise at
 * yesterday. That means a streak does not break the instant midnight passes —
 * it breaks when a full day goes by with nothing. Someone who studied
 * yesterday and has not opened the app yet today still has their streak, and
 * is `atRisk` until they do.
 */
export function computeStreak(activeDates, now, timeZone = 'UTC') {
    const unique = [...new Set(activeDates)].sort();
    if (unique.length === 0) {
        return { current: 0, longest: 0, activeToday: false, atRisk: false };
    }
    let longest = 1;
    let run = 1;
    for (let i = 1; i < unique.length; i++) {
        const prev = unique[i - 1];
        const curr = unique[i];
        run = addCalendarDays(prev, 1) === curr ? run + 1 : 1;
        if (run > longest)
            longest = run;
    }
    const today = toCalendarDate(now, timeZone);
    const yesterday = addCalendarDays(today, -1);
    const lastActiveDate = unique[unique.length - 1];
    const activeToday = lastActiveDate === today;
    // The streak is live only if the last active day was today or yesterday.
    let current = 0;
    if (lastActiveDate === today || lastActiveDate === yesterday) {
        current = 1;
        for (let i = unique.length - 1; i > 0; i--) {
            if (addCalendarDays(unique[i - 1], 1) === unique[i])
                current += 1;
            else
                break;
        }
    }
    return {
        current,
        longest,
        lastActiveDate,
        activeToday,
        atRisk: current > 0 && !activeToday,
    };
}
/** 0–100 completion across a module's Reps. */
export function moduleCompletionPercent(progress, repIds) {
    if (repIds.length === 0)
        return 0;
    const done = repIds.filter((id) => progress.reps[id]?.completedAt).length;
    return Math.round((done / repIds.length) * 100);
}
/** Whole days since the learner started. Reported in every Level 2+ digest. */
export function daysSinceStart(progress, now) {
    return Math.max(0, Math.floor((now.getTime() - progress.startedAt.getTime()) / MS_PER_DAY));
}
/** The next Rep the learner should see: first not completed, in course order. */
export function nextRepFor(progress) {
    return module01.reps.find((rep) => !progress.reps[rep.id]?.completedAt)?.id;
}
//# sourceMappingURL=engine.js.map