import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  applyActivity,
  computeStreak,
  daysSinceStart,
  emptyProgress,
  moduleCompletionPercent,
  nextRepFor,
  recordQuizAttempt,
  XP,
} from './engine.js';
import { module01 } from '@nms/content';
import type { ActivityEvent } from './types.js';

const START = new Date('2026-08-03T09:00:00Z');
const at = (iso: string) => new Date(`${iso}T10:00:00Z`);

const event = (over: Partial<ActivityEvent> & Pick<ActivityEvent, 'type' | 'at'>): ActivityEvent => ({
  id: Math.random().toString(36).slice(2),
  enrollmentId: 'e1',
  ...over,
});

describe('applyActivity', () => {
  test('does not mutate the input', () => {
    const before = emptyProgress('e1', START);
    const after = applyActivity(before, event({ type: 'rep-completed', repId: 'm1-r1', at: at('2026-08-10') }));
    assert.equal(before.xp, 0);
    assert.equal(after.xp, XP.repCompleted);
    assert.notEqual(before, after);
  });

  test('completing a Rep twice only awards XP once', () => {
    let p = emptyProgress('e1', START);
    const e = event({ type: 'rep-completed', repId: 'm1-r1', at: at('2026-08-10') });
    p = applyActivity(p, e);
    p = applyActivity(p, { ...e, id: 'again' });
    assert.equal(p.xp, XP.repCompleted);
  });

  test('every activity type records an active date, not just completions', () => {
    // The inactivity spec is explicit that opening a section counts.
    let p = emptyProgress('e1', START);
    p = applyActivity(p, event({ type: 'rep-opened', repId: 'm1-r1', at: at('2026-08-10') }));
    assert.deepEqual(p.activeDates, ['2026-08-10']);
  });
});

describe('recordQuizAttempt', () => {
  const allCorrect = () =>
    module01.reps[0]!.quiz.map((q) => ({
      questionId: q.id,
      optionId: q.options.find((o) => o.correct)!.id,
    }));

  test('scores a perfect attempt at 100 and passes it', () => {
    const { attempt } = recordQuizAttempt(emptyProgress('e1', START), 'm1-r1', allCorrect(), at('2026-08-10'));
    assert.equal(attempt.score, 100);
    // Derived, not hardcoded: the quiz grew from 3 questions to 10 when the
    // approved quiz document landed, and it will grow again for 1.3 onward.
    assert.equal(attempt.correctCount, module01.reps[0]!.quiz.length);
    assert.equal(attempt.passed, true);
  });

  test('one wrong answer is scored proportionally and can still pass', () => {
    const total = module01.reps[0]!.quiz.length;
    const answers = allCorrect();
    const q = module01.reps[0]!.quiz[0]!;
    answers[0] = { questionId: q.id, optionId: q.options.find((o) => !o.correct)!.id };

    const { attempt } = recordQuizAttempt(
      emptyProgress('e1', START),
      'm1-r1',
      answers,
      at('2026-08-10'),
    );
    assert.equal(attempt.correctCount, total - 1);
    assert.equal(attempt.score, Math.round(((total - 1) / total) * 100));
    // 9 of 10 clears the 85% bar; 2 of 3 did not. The threshold did not move,
    // the quiz got long enough for one mistake to stop being fatal.
    assert.equal(attempt.passed, attempt.score >= 85);
  });

  test('unanswered questions count as wrong rather than throwing', () => {
    const { attempt } = recordQuizAttempt(emptyProgress('e1', START), 'm1-r1', [], at('2026-08-10'));
    assert.equal(attempt.score, 0);
  });

  test('retakes are allowed and bestScore keeps the high mark', () => {
    let p = emptyProgress('e1', START);
    p = recordQuizAttempt(p, 'm1-r1', [], at('2026-08-10')).progress;
    p = recordQuizAttempt(p, 'm1-r1', allCorrect(), at('2026-08-11')).progress;
    assert.equal(p.reps['m1-r1']!.attempts.length, 2);
    assert.equal(p.reps['m1-r1']!.bestScore, 100);
  });

  test('XP is awarded on the first attempt only, so failing cannot be farmed', () => {
    let p = emptyProgress('e1', START);
    p = recordQuizAttempt(p, 'm1-r1', [], at('2026-08-10')).progress;
    assert.equal(p.xp, 0, 'nothing correct on attempt one');
    p = recordQuizAttempt(p, 'm1-r1', allCorrect(), at('2026-08-11')).progress;
    assert.equal(p.xp, 0, 'the retake still scores 100 but earns no XP');
  });

  test('an unknown rep is a programming error, not a silent no-op', () => {
    assert.throws(() => recordQuizAttempt(emptyProgress('e1', START), 'nope', [], at('2026-08-10')), /Unknown rep/);
  });
});

describe('computeStreak', () => {
  test('no activity is a zero streak', () => {
    const s = computeStreak([], at('2026-08-12'));
    assert.equal(s.current, 0);
    assert.equal(s.atRisk, false);
  });

  test('three consecutive days ending today is a 3-day streak', () => {
    const s = computeStreak(['2026-08-10', '2026-08-11', '2026-08-12'], at('2026-08-12'));
    assert.equal(s.current, 3);
    assert.equal(s.activeToday, true);
    assert.equal(s.atRisk, false);
  });

  test('a streak does not break at midnight — only after a full day is missed', () => {
    const s = computeStreak(['2026-08-10', '2026-08-11'], at('2026-08-12'));
    assert.equal(s.current, 2, 'yesterday was active, so the streak is still live');
    assert.equal(s.activeToday, false);
    assert.equal(s.atRisk, true, 'it survives only until end of today');
  });

  test('a missed day breaks it', () => {
    const s = computeStreak(['2026-08-10', '2026-08-11'], at('2026-08-13'));
    assert.equal(s.current, 0);
    assert.equal(s.atRisk, false, 'nothing left to be at risk of');
  });

  test('longest is remembered after a break', () => {
    const s = computeStreak(
      ['2026-08-01', '2026-08-02', '2026-08-03', '2026-08-04', '2026-08-11', '2026-08-12'],
      at('2026-08-12'),
    );
    assert.equal(s.current, 2);
    assert.equal(s.longest, 4);
  });

  test('duplicate dates on one day count once', () => {
    const s = computeStreak(['2026-08-12', '2026-08-12', '2026-08-12'], at('2026-08-12'));
    assert.equal(s.current, 1);
  });

  test('the streak follows the learner’s zone, not the server’s', () => {
    // 23:00 on the 12th in Denver is already the 13th in UTC.
    const instant = new Date('2026-08-13T05:00:00Z');
    assert.equal(computeStreak(['2026-08-12'], instant, 'America/Denver').activeToday, true);
    assert.equal(computeStreak(['2026-08-12'], instant, 'UTC').activeToday, false);
  });
});

describe('module progress', () => {
  test('completion percent tracks completed Reps', () => {
    let p = emptyProgress('e1', START);
    const repIds = module01.reps.map((r) => r.id);
    assert.equal(moduleCompletionPercent(p, repIds), 0);
    p = applyActivity(p, event({ type: 'rep-completed', repId: 'm1-r1', at: at('2026-08-10') }));
    p = applyActivity(p, event({ type: 'rep-completed', repId: 'm1-r2', at: at('2026-08-10') }));
    assert.equal(moduleCompletionPercent(p, repIds), 25, '2 of 8');
  });

  test('nextRepFor returns the first incomplete Rep in course order', () => {
    let p = emptyProgress('e1', START);
    assert.equal(nextRepFor(p), 'm1-r1');
    p = applyActivity(p, event({ type: 'rep-completed', repId: 'm1-r1', at: at('2026-08-10') }));
    assert.equal(nextRepFor(p), 'm1-r2');
  });

  test('nextRepFor is undefined once the module is finished', () => {
    let p = emptyProgress('e1', START);
    for (const rep of module01.reps) {
      p = applyActivity(p, event({ type: 'rep-completed', repId: rep.id, at: at('2026-08-10') }));
    }
    assert.equal(nextRepFor(p), undefined);
  });

  test('daysSinceStart counts whole days and never goes negative', () => {
    const p = emptyProgress('e1', START);
    assert.equal(daysSinceStart(p, new Date('2026-08-10T09:00:00Z')), 7);
    assert.equal(daysSinceStart(p, new Date('2026-08-01T09:00:00Z')), 0);
  });
});
