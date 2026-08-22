import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  course,
  feedCards,
  isInteractive,
  contentAdditions,
  module01,
  validateContent,
  estimateSectionTotalSeconds,
  splitListItem,
  splitMomentLines,
} from '@nms/content';

/**
 * Content integrity. These live in core rather than in the content package so
 * one `npm test` covers both, and so a content edit that breaks a product rule
 * fails CI rather than production.
 */

describe('Module 1 content', () => {
  test('passes structural validation', () => {
    assert.deepEqual(validateContent(), []);
  });

  test('has eight lessons, numbered 1.1 through 1.8', () => {
    assert.equal(module01.sections.length, 8);
    assert.deepEqual(
      module01.sections.map((r) => r.number),
      ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8'],
    );
  });

  test('every lesson has a hook and a key idea', () => {
    for (const section of module01.sections) {
      assert.ok(section.hook.length > 0, `${section.number}: no hook`);
      assert.ok(section.keyIdea.length > 0, `${section.number}: no key idea`);
    }
  });

  test('"Situational Leadership" reaches no learner', () => {
    // A registered trademark of the Center for Leadership Studies. See D6 in
    // docs/product/IP_PUNCH_LIST.md; section 1.6 ships as "Managing in the
    // Moment" with the model named "The Readiness Dial".
    //
    // The deviation records quote the original wording, which is the point of
    // an audit trail, so they are excluded rather than the assertion weakened.
    const shipped = module01.sections.map(({ scriptDeviations, ...rest }) => rest);
    assert.equal(JSON.stringify(shipped).toLowerCase().includes('situational leadership'), false);
  });
});

describe('a lesson is a video and then a quiz', () => {
  test('every lesson opens on a cold open and closes on a summary', () => {
    for (const section of module01.sections) {
      const cards = feedCards(section);
      assert.equal(cards[0]!.kind, 'sectionIntro', `${section.number}: does not open on a cold open`);
      assert.equal(cards[1]!.kind, 'video', `${section.number}: the video is not the second card`);
      assert.equal(cards.at(-1)!.kind, 'summary', `${section.number}: does not close on a summary`);
    }
  });

  test('the cards between the video and the summary are all quiz questions', () => {
    for (const section of module01.sections) {
      const middle = feedCards(section).slice(2, -1);
      assert.ok(middle.length > 0, `${section.number}: no questions`);
      assert.ok(
        middle.every((c) => c.kind === 'quiz'),
        `${section.number}: something other than a question sits between the video and the summary`,
      );
      assert.equal(middle.length, section.quiz.length);
    }
  });

  test('the quiz is the only thing the learner has to act on', () => {
    for (const section of module01.sections) {
      const interactive = feedCards(section).filter(isInteractive);
      assert.ok(interactive.every((c) => c.kind === 'quiz'));
      assert.equal(interactive.length, section.quiz.length);
    }
  });

  test('card keys are unique, so the feed cannot collapse two cards into one', () => {
    for (const section of module01.sections) {
      const keys = feedCards(section).map((c) => c.key);
      assert.equal(new Set(keys).size, keys.length, `${section.number}: duplicate card key`);
    }
  });
});

describe('quizzes', () => {
  /*
   * The approved quiz document specifies ten four-option questions per
   * section, and from 1.2 onward two of them are review from earlier sections.
   * Only 1.1 and 1.2 have been written; the rest carry placeholders and are
   * tracked in IP_PUNCH_LIST.md.
   */
  const AUTHORED = ['1.1', '1.2'];

  test('the authored lessons carry the full ten questions', () => {
    for (const number of AUTHORED) {
      const section = module01.sections.find((r) => r.number === number)!;
      assert.equal(section.quiz.length, 10, `${number}: expected 10 questions`);
    }
  });

  test('every question has four options and exactly one correct answer', () => {
    for (const section of module01.sections) {
      for (const q of section.quiz) {
        assert.equal(q.options.length, 4, `${section.number}/${q.id}: not four options`);
        assert.equal(
          q.options.filter((o) => o.correct).length,
          1,
          `${section.number}/${q.id}: not exactly one correct answer`,
        );
      }
    }
  });

  test('every option explains itself, including the wrong ones', () => {
    // Feedback on a wrong answer is where the quiz teaches rather than tests.
    for (const section of module01.sections) {
      for (const q of section.quiz) {
        for (const o of q.options) {
          assert.ok(o.feedback.length > 0, `${section.number}/${q.id}/${o.id}: no feedback`);
        }
      }
    }
  });

  test('lesson 1.2 carries review questions from an earlier section', () => {
    // Spaced repetition, per the quiz document.
    // A review question is one sourced from a different section than the one
    // it appears in. Not necessarily an earlier one: the quiz document's
    // second review question is labelled "From Section 1.1" but asks about
    // emotional contagion, which is section 1.4. Recorded in the punch list.
    const section = module01.sections.find((r) => r.number === '1.2')!;
    const review = section.quiz.filter((q) => q.source && q.source !== section.number);
    assert.ok(review.length >= 2, `expected at least 2 review questions, found ${review.length}`);
  });

  test('the lessons still awaiting Tom’s questions are exactly the ones we know about', () => {
    // A ratchet. When this list is empty the placeholder note in the punch
    // list comes out too.
    const placeholder = module01.sections.filter((r) => r.quiz.length < 10).map((r) => r.number);
    assert.deepEqual(placeholder, ['1.3', '1.4', '1.5', '1.6', '1.7', '1.8']);
  });
});

describe('video wiring', () => {
  test('no two lessons point at the same film', () => {
    const owners = new Map<string, string>();
    for (const section of module01.sections) {
      if (!section.videoUrl) continue;
      const first = owners.get(section.videoUrl);
      assert.equal(first, undefined, `${section.number} duplicates the film on ${first}`);
      owners.set(section.videoUrl, section.number);
    }
  });

  test('every wired film is a direct URL, not a share page', () => {
    for (const section of module01.sections) {
      if (!section.videoUrl) continue;
      // The extension is read off the path: a signed URL carries its token in
      // the query, so the last characters are never the file type.
      const path = new URL(section.videoUrl).pathname;
      assert.match(path, /\.(mp4|m3u8|webm)$/, `${section.number}: not a direct video URL`);
    }
  });

  test('a lesson with no film still has a script to render', () => {
    // The player falls back to the script, so a lesson without footage is a
    // lesson rather than an empty screen.
    for (const section of module01.sections) {
      if (section.videoUrl) continue;
      const words = section.beats.filter((b) => b.speech).length;
      assert.ok(words > 0, `${section.number}: no film and no script`);
    }
  });
});

describe('runtime', () => {
  test('a lesson lands in a plausible range once the quiz is counted', () => {
    for (const section of module01.sections) {
      const seconds = estimateSectionTotalSeconds(section);
      assert.ok(seconds > 60, `${section.number}: ${seconds}s is too short to be a lesson`);
      assert.ok(seconds < 20 * 60, `${section.number}: ${seconds}s is longer than anyone will sit`);
    }
  });
});

describe('provenance', () => {
  test('nothing added to a locked script is marked approved yet', () => {
    for (const addition of contentAdditions()) {
      assert.equal(
        addition.status,
        'proposed',
        `${addition.ref}: marked ${addition.status} without a recorded sign-off`,
      );
    }
  });
});

describe('build-list parsing', () => {
  // The script markup is still parsed for the shot list and the transcript,
  // even though the feed no longer renders one card per beat.
  test('pulls the label out of a colon-prefixed item', () => {
    const { label, body, quoted } = splitListItem(
      'Myth #1: “I’ll just do what my old manager did.”',
    );
    assert.equal(label, 'Myth #1');
    assert.equal(body, 'I’ll just do what my old manager did.');
    assert.equal(quoted, true);
  });

  test('does not invent a label where there is only prose', () => {
    const { label } = splitListItem('Productivity drops. Conflict increases.');
    assert.equal(label, undefined);
  });
});

describe('moment parsing', () => {
  test('separates the payoff sentence from the setup', () => {
    assert.deepEqual(
      splitMomentLines('Employees don’t quit companies. They quit managers.'),
      ['Employees don’t quit companies.', 'They quit managers.'],
    );
  });

  test('leaves a single-sentence moment whole', () => {
    const one = 'You can’t manage others effectively until you can manage yourself first.';
    assert.deepEqual(splitMomentLines(one), [one]);
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
});
