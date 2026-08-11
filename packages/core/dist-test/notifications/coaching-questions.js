import { findRep } from '@nms/content';
/**
 * Level 3 conversation prompts.
 *
 * The spec: "suggested 1:1 questions for the contact to ask the student —
 * generated from (a) the student's own open-ended/fill-in-the-blank answers
 * and (b) the content/topic of each section."
 *
 * ── The privacy problem this design solves ────────────────────────────────
 *
 * Source (a) is a learner's private written reflection. Several of Module 1's
 * Field Notes ask for genuinely sensitive material: 1.3 asks which working
 * relationship has changed most, 1.7 asks which standard they are failing to
 * hold themselves to. The contact receiving the Level 3 digest is frequently
 * that learner's own boss.
 *
 * If a boss can read those answers verbatim, learners will work out within one
 * module that honest answers are career-limiting, and start writing for the
 * audience. The Field Notes stop being useful — which also breaks Level 3,
 * because the generator would then be working from performance rather than
 * reflection.
 *
 * So the guarantee is: the contact receives a *question to ask*, never the
 * answer. Generated prompts are built from the section topic and, at most,
 * short extracted subject phrases — bounded by MAX_ECHOED_WORDS and asserted
 * by a test that no long verbatim span from the learner's text can survive.
 *
 * ── MVP implementation ────────────────────────────────────────────────────
 *
 * Deterministic templates. No model call: it is testable, free, instant, and
 * cannot leak the learner's text to a third-party API — which matters when the
 * pilot buyers are HR departments. `CoachingQuestionGenerator` is an interface
 * so a model-backed generator can replace it in V2 behind the same privacy
 * assertions. See docs/product/ROADMAP.md § Level 3 V2.
 */
/**
 * Longest run of consecutive words that may be echoed from a learner's answer.
 * Four is enough to name a subject ("the new scheduling process") and too few
 * to carry a confession.
 */
export const MAX_ECHOED_WORDS = 4;
/** Topic-only questions. Used when a Rep was completed but no Field Note was written. */
const TOPIC_QUESTIONS = {
    'The invisible promotion': [
        'What part of the manager job has turned out to be nothing like you expected?',
        'What is something about your new role that nobody explained to you?',
    ],
    'The doer trap': [
        'What are you still doing yourself that someone on your team could be doing?',
        'When did you last take a task back off someone — and what happened after?',
    ],
    'Relationship reset': [
        'Which working relationship has been hardest to renegotiate since the promotion?',
        'Where have you had to draw a line that you would not have had to draw a year ago?',
    ],
    'Energy and presence': [
        'What does your team see in you on a bad day?',
        'What do you do to reset before a difficult conversation?',
    ],
    'Self-regulation and triggers': [
        'What situation at work most reliably gets under your skin?',
        'Tell me about a time recently you paused instead of reacting. What did it change?',
    ],
    'Readiness and adapting your style': [
        'Who on your team needs a different level of involvement from you than they did six months ago?',
        'Where are you giving someone autonomy they have not asked for?',
    ],
    'Leading by example and ownership': [
        'What standard have you set for the team that you are finding hardest to hold yourself to?',
        'What have you let slide recently that you would not accept from someone else?',
    ],
    'Module 1 commitment': [
        'What is the one thing you decided to change — and has it actually happened yet?',
        'What would need to be true next month for you to say this course was worth the time?',
    ],
};
/** Fallback when a topic has no bespoke questions. */
function genericForTopic(topic) {
    return [
        `What came up for you in the section on ${topic.toLowerCase()}?`,
        `Where is ${topic.toLowerCase()} showing up in your week right now?`,
    ];
}
const STOP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'to', 'of', 'in', 'on', 'at', 'for', 'with', 'about', 'that', 'this', 'these', 'those',
    'i', 'me', 'my', 'we', 'our', 'you', 'your', 'it', 'its', 'they', 'them', 'their',
    'have', 'has', 'had', 'do', 'does', 'did', 'not', 'no', 'so', 'as', 'if', 'then',
    'just', 'really', 'very', 'because', 'what', 'when', 'how', 'who', 'would', 'could',
    'should', 'am', 'get', 'got', 'like', 'know', 'think', 'feel', 'one', 'thing', 'things',
]);
/**
 * Pulls short subject phrases out of a learner's answer.
 *
 * Returns runs of at most MAX_ECHOED_WORDS content words. Anything that would
 * carry the learner's meaning across — a whole clause, a sentence — is by
 * construction too long to be returned.
 */
export function extractSubjectPhrases(text, limit = 2) {
    const phrases = [];
    for (const sentence of text.split(/[.!?\n]+/)) {
        let run = [];
        for (const raw of sentence.split(/\s+/)) {
            const word = raw.replace(/[^\p{L}\p{N}'-]/gu, '');
            if (!word)
                continue;
            if (STOP_WORDS.has(word.toLowerCase()) || word.length < 3) {
                if (run.length >= 2)
                    phrases.push(run.slice(0, MAX_ECHOED_WORDS).join(' '));
                run = [];
                continue;
            }
            run.push(word);
            if (run.length === MAX_ECHOED_WORDS) {
                phrases.push(run.join(' '));
                run = [];
            }
        }
        if (run.length >= 2)
            phrases.push(run.slice(0, MAX_ECHOED_WORDS).join(' '));
    }
    return phrases.map((p) => p.toLowerCase()).slice(0, limit);
}
/**
 * The MVP generator. Deterministic, offline, and incapable of forwarding a
 * learner's words to anyone.
 */
export const templateGenerator = {
    generate({ answers, completedRepIds, max = 3 }) {
        const questions = [];
        const seen = new Set();
        const push = (q) => {
            const key = q.question.toLowerCase();
            if (seen.has(key))
                return;
            seen.add(key);
            questions.push(q);
        };
        // Answered Field Notes first — they are the richer signal.
        // Most recent first, so a digest reflects the week the contact just had.
        const sorted = [...answers].sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime());
        for (const answer of sorted) {
            const rep = findRep(answer.repId);
            const source = rep?.number ?? answer.repId;
            const pool = TOPIC_QUESTIONS[answer.topic] ?? genericForTopic(answer.topic);
            const phrases = extractSubjectPhrases(answer.text);
            if (phrases.length > 0 && phrases[0]) {
                push({
                    question: `You mentioned ${phrases[0]} — talk me through where that stands now.`,
                    rationale: `They wrote about this in Rep ${source} (${answer.topic}). Their answer itself stays private.`,
                    source,
                    basis: 'answer',
                });
            }
            if (pool[0]) {
                push({
                    question: pool[0],
                    rationale: `Rep ${source} — ${answer.topic}. They completed the reflection for this section.`,
                    source,
                    basis: 'topic',
                });
            }
        }
        // Then topic-only questions for Reps completed without a Field Note.
        const answeredReps = new Set(answers.map((a) => a.repId));
        for (const repId of completedRepIds) {
            if (answeredReps.has(repId))
                continue;
            const rep = findRep(repId);
            if (!rep)
                continue;
            const pool = TOPIC_QUESTIONS[rep.fieldNote.topic] ?? genericForTopic(rep.fieldNote.topic);
            if (pool[0]) {
                push({
                    question: pool[0],
                    rationale: `Rep ${rep.number} — ${rep.title}.`,
                    source: rep.number,
                    basis: 'topic',
                });
            }
        }
        return questions.slice(0, max);
    },
};
//# sourceMappingURL=coaching-questions.js.map