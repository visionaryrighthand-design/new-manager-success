import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { sectionCompleteNotifications, weeklyDigestNotifications } from './dispatch.js';
import { templateGenerator } from './coaching-questions.js';
import { module01 } from '@nms/content';
import type { Enrollment } from '../registration/types.js';
import { emptyProgress, recordQuizAttempt, applyActivity } from '../progress/engine.js';

const WEEK_START = new Date('2026-08-10T00:00:00Z');
const WEEK_END = new Date('2026-08-17T00:00:00Z');

const enrollment: Enrollment = {
  id: 'e1',
  entry: 'other-individual',
  student: { name: 'Dana Reyes', email: 'dana@example.com' },
  registeredBy: { name: 'Sam Okafor', email: 'sam@example.com' },
  startedAt: new Date('2026-08-03T09:00:00Z'),
  contacts: [
    { id: 'c1', name: 'Lee Park', email: 'lee@example.com', role: 'boss', level: 1 },
    { id: 'c2', name: 'Jo Silva', email: 'jo@example.com', role: 'hr', level: 2 },
    { id: 'c3', name: 'Sam Okafor', email: 'sam@example.com', role: 'registrant', level: 3 },
  ],
};

describe('Level 1 — real-time per section', () => {
  test('only Level 1 contacts get the per-section notification', () => {
    const notes = sectionCompleteNotifications(enrollment, 'm1-r1');
    assert.equal(notes.length, 1);
    assert.equal(notes[0]!.to.id, 'c1');
    assert.equal(notes[0]!.triggeredByLevel, 1);
  });

  test('Level 2 and 3 are not double-sent — that content is in their digest', () => {
    const notes = sectionCompleteNotifications(enrollment, 'm1-r1');
    assert.equal(notes.some((n) => n.to.level > 1), false);
  });

  test('the notification names the section and its key idea', () => {
    const [note] = sectionCompleteNotifications(enrollment, 'm1-r3');
    assert.match(note!.subject, /1\.3/);
    assert.match(note!.subject, /Relationship Reset/);
    assert.equal(note!.body.some((b) => b.type === 'stat' && b.label === 'Key idea'), true);
  });

  test('an unknown rep produces nothing rather than throwing', () => {
    assert.deepEqual(sectionCompleteNotifications(enrollment, 'nope'), []);
  });
});

describe('Level 2 and 3 — weekly digest', () => {
  function progressWithAWeek() {
    let p = emptyProgress('e1', enrollment.startedAt);
    for (const repId of ['m1-r1', 'm1-r2']) {
      p = applyActivity(p, {
        id: `a-${repId}`,
        enrollmentId: 'e1',
        type: 'rep-completed',
        repId,
        at: new Date('2026-08-12T10:00:00Z'),
      });
    }
    // Answers derived from the content rather than listed: the quiz went from
    // three questions to ten when the approved document landed, and hardcoded
    // option ids quietly turned a perfect run into a 10% one.
    p = recordQuizAttempt(
      p,
      'm1-r1',
      module01.reps[0]!.quiz.map((q) => ({
        questionId: q.id,
        optionId: q.options.find((o) => o.correct)!.id,
      })),
      new Date('2026-08-12T10:05:00Z'),
    ).progress;
    return p;
  }

  test('Level 2 and Level 3 both receive a digest; Level 1 does not', () => {
    const notes = weeklyDigestNotifications({
      enrollment,
      progress: progressWithAWeek(),
      weekStart: WEEK_START,
      weekEnd: WEEK_END,
    });
    assert.deepEqual(notes.map((n) => n.to.id).sort(), ['c2', 'c3']);
  });

  test('the digest carries sections completed, scores, and days since starting', () => {
    const notes = weeklyDigestNotifications({
      enrollment,
      progress: progressWithAWeek(),
      weekStart: WEEK_START,
      weekEnd: WEEK_END,
    });
    const level2 = notes.find((n) => n.to.level === 2)!;
    const titles = level2.body.flatMap((b) => (b.type === 'list' ? [b.title] : []));
    assert.equal(titles.some((t) => t.startsWith('Completed this week')), true);
    assert.equal(titles.includes('Quiz scores'), true);
    assert.equal(
      level2.body.some((b) => b.type === 'stat' && b.label === 'Days since starting'),
      true,
    );
  });

  test('a perfect quiz is reported as 100% and passed', () => {
    const notes = weeklyDigestNotifications({
      enrollment,
      progress: progressWithAWeek(),
      weekStart: WEEK_START,
      weekEnd: WEEK_END,
    });
    const scores = notes[0]!.body.find((b) => b.type === 'list' && b.title === 'Quiz scores');
    assert.ok(scores && scores.type === 'list');
    // Derived: the quiz length changes as the approved questions land.
    const total = module01.reps[0]!.quiz.length;
    assert.match(scores.items[0]!, new RegExp(`100% \\(${total}/${total}, passed\\)`));
  });

  test('Level 3 gets conversation prompts, Level 2 does not', () => {
    const notes = weeklyDigestNotifications({
      enrollment,
      progress: progressWithAWeek(),
      weekStart: WEEK_START,
      weekEnd: WEEK_END,
    });
    const level2 = notes.find((n) => n.to.level === 2)!;
    const level3 = notes.find((n) => n.to.level === 3)!;
    assert.equal(level2.body.some((b) => b.type === 'questions'), false);
    assert.equal(level3.body.some((b) => b.type === 'questions'), true);
  });

  test('a quiet week is reported honestly rather than dressed up', () => {
    const notes = weeklyDigestNotifications({
      enrollment,
      progress: emptyProgress('e1', enrollment.startedAt),
      weekStart: WEEK_START,
      weekEnd: WEEK_END,
    });
    assert.match(notes[0]!.subject, /0 sections completed/);
    assert.equal(
      notes[0]!.body.some((b) => b.type === 'paragraph' && /did not complete any sections/.test(b.text)),
      true,
    );
  });

  test('work from a previous week is not counted again', () => {
    const p = applyActivity(emptyProgress('e1', enrollment.startedAt), {
      id: 'a1',
      enrollmentId: 'e1',
      type: 'rep-completed',
      repId: 'm1-r1',
      at: new Date('2026-08-05T10:00:00Z'), // before WEEK_START
    });
    const notes = weeklyDigestNotifications({
      enrollment,
      progress: p,
      weekStart: WEEK_START,
      weekEnd: WEEK_END,
    });
    assert.match(notes[0]!.subject, /0 sections completed/);
  });

  test('an enrollment with no Level 2+ contacts produces no digest at all', () => {
    const selfDirected: Enrollment = { ...enrollment, contacts: [] };
    assert.deepEqual(
      weeklyDigestNotifications({
        enrollment: selfDirected,
        progress: progressWithAWeek(),
        weekStart: WEEK_START,
        weekEnd: WEEK_END,
      }),
      [],
    );
  });
});

describe('Level 3 conversation prompts', () => {
  /*
   * Field Notes are gone, so the privacy invariant they needed — no verbatim
   * span of a learner's private writing reaching their boss — no longer has
   * anything to protect. What replaced it is narrower: prompts come from the
   * lessons covered and the questions missed, both of which a Level 2 contact
   * already sees as a score.
   */
  test('a missed question produces a sharper prompt than the topic alone', () => {
    const rep = module01.reps.find((r) => r.number === '1.1')!;
    const missed = rep.quiz[0]!;

    const withMiss = templateGenerator.generate({
      completedRepIds: [rep.id],
      missedQuestionIds: [missed.id],
    });
    const withoutMiss = templateGenerator.generate({ completedRepIds: [rep.id] });

    assert.equal(withMiss[0]?.basis, 'missed');
    assert.equal(withoutMiss[0]?.basis, 'topic');
    assert.notEqual(withMiss[0]?.question, withoutMiss[0]?.question);
  });

  test('a prompt never repeats a quiz stem verbatim', () => {
    // A stem reads like a test question. The contact is being handed a
    // conversation opener, not an exam paper.
    const rep = module01.reps.find((r) => r.number === '1.1')!;
    const questions = templateGenerator.generate({
      completedRepIds: [rep.id],
      missedQuestionIds: rep.quiz.map((q) => q.id),
      max: 5,
    });
    for (const q of questions) {
      for (const quizQuestion of rep.quiz) {
        assert.equal(
          q.question.includes(quizQuestion.stem),
          false,
          `prompt repeats a stem verbatim: "${quizQuestion.stem}"`,
        );
      }
    }
  });

  test('at most one prompt per lesson, however many were missed', () => {
    const rep = module01.reps.find((r) => r.number === '1.1')!;
    const questions = templateGenerator.generate({
      completedRepIds: [rep.id],
      missedQuestionIds: rep.quiz.map((q) => q.id),
      max: 5,
    });
    assert.equal(questions.filter((q) => q.basis === 'missed').length, 1);
  });

  test('questions are still generated when nothing was missed', () => {
    const questions = templateGenerator.generate({ completedRepIds: ['m1-r3'] });
    assert.ok(questions.length > 0);
    assert.ok(questions.every((q) => q.basis === 'topic'));
  });
});
