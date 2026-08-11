import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { course, module01, validateContent, estimateRepTotalSeconds } from '@promoted/content';

/**
 * Content integrity. These live in core rather than in the content package so
 * one `npm test` covers both, and so a content edit that breaks a product rule
 * fails CI rather than production.
 */

describe('Module 1 content', () => {
  test('passes structural validation', () => {
    const problems = validateContent();
    assert.deepEqual(problems, [], problems.join('\n'));
  });

  test('has all eight Reps from the approved outline, in order', () => {
    assert.equal(module01.reps.length, 8);
    assert.deepEqual(
      module01.reps.map((r) => r.number),
      ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8'],
    );
  });

  test('every Rep has a Field Note — Level 3 digests depend on it', () => {
    // "Every section must contain at least one open-ended question to support this."
    for (const rep of module01.reps) {
      assert.ok(rep.fieldNote, `Rep ${rep.number} has no Field Note`);
      assert.ok(rep.fieldNote.prompt.trim().length > 0);
      assert.ok(rep.fieldNote.topic.trim().length > 0);
    }
  });

  test('no Rep still names the trademark flagged in D6', () => {
    const term = /situational leadership/i;
    for (const rep of module01.reps) {
      const surface = [
        rep.title,
        rep.subtitle ?? '',
        rep.hook,
        rep.keyIdea,
        ...rep.topics,
        ...rep.beats.flatMap((b) => [b.speech ?? '', b.text ?? '', ...(b.items ?? [])]),
        ...rep.quiz.flatMap((q) => [q.stem, ...q.options.flatMap((o) => [o.text, o.feedback])]),
        ...rep.curveballs.flatMap((c) => [c.scenario, c.prompt, ...c.choices.flatMap((ch) => [ch.text, ch.response])]),
      ].join(' ');
      assert.equal(term.test(surface), false, `Rep ${rep.number} still uses the flagged term`);
    }
  });

  test('every deviation from a locked script is recorded with a sign-off owner', () => {
    for (const rep of module01.reps) {
      for (const d of rep.scriptDeviations ?? []) {
        assert.ok(d.ref, 'deviation needs a punch-list ref');
        assert.ok(d.reason.length > 20, `${d.ref}: reason is too thin to review`);
        assert.ok(d.needsSignoffFrom, `${d.ref}: no sign-off owner`);
      }
    }
  });

  test('each Rep lands within a minute of the seven-minute promise', () => {
    // Narration alone runs short (see docs/product/MVP_SPEC.md § Runtime);
    // what the learner actually spends is narration plus interactions.
    for (const rep of module01.reps) {
      const seconds = estimateRepTotalSeconds(rep);
      assert.ok(
        seconds >= 6 * 60 && seconds <= 9 * 60,
        `Rep ${rep.number} runs ${Math.round(seconds / 60)}m in-app`,
      );
    }
  });

  test('quiz options are shuffle-safe — the correct answer is not always in one slot', () => {
    const positions = new Set(
      module01.reps.flatMap((r) => r.quiz.map((q) => q.options.findIndex((o) => o.correct))),
    );
    assert.ok(positions.size > 1, 'correct answers are all in the same position');
  });

  test('every Curveball offers a genuinely costly option as well as a best one', () => {
    for (const rep of module01.reps) {
      for (const cb of rep.curveballs) {
        const verdicts = new Set(cb.choices.map((c) => c.verdict));
        assert.ok(verdicts.has('best'), `${cb.id} has no best choice`);
        assert.ok(
          verdicts.size > 1,
          `${cb.id} has only one verdict — nothing to discriminate`,
        );
      }
    }
  });
});

describe('course shape', () => {
  test('all twelve modules from the outline appear on the roadmap', () => {
    assert.equal(course.roadmap.length, 12);
    assert.deepEqual(
      course.roadmap.map((m) => m.number),
      Array.from({ length: 12 }, (_, i) => i + 1),
    );
  });

  test('only Module 1 is live in the MVP', () => {
    assert.deepEqual(
      course.roadmap.filter((m) => m.status === 'live').map((m) => m.number),
      [1],
    );
  });

  test('Module 2 is marked in-production, matching "scripts drafted, not yet locked"', () => {
    assert.equal(course.roadmap.find((m) => m.number === 2)?.status, 'in-production');
  });
});
