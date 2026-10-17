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
  sectionChecks,
  sectionMinutes,
  sectionTranscript,
  sectionVideos,
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
   * Ten four-option questions per section, with review questions from earlier
   * sections mixed in from 1.2 onward.
   *
   * 1.1 and 1.2 are the approved quiz document's, verbatim. 1.3 to 1.8 are
   * ours, written against each section's script because the document stops
   * after 1.2 — recorded in IP_PUNCH_LIST.md and awaiting the author's
   * sign-off. The placeholder quizzes they replaced are gone.
   */
  const FROM_APPROVED_DOCUMENT = ['1.1', '1.2'];

  test('every section carries the full ten questions', () => {
    for (const section of module01.sections) {
      assert.equal(section.quiz.length, 10, `${section.number}: expected 10 questions`);
    }
  });

  test('the two sections the quiz document covers are still the document’s', () => {
    // A ratchet in the other direction: if the document is ever extended,
    // this list grows rather than the distinction being quietly lost.
    for (const number of FROM_APPROVED_DOCUMENT) {
      const section = module01.sections.find((r) => r.number === number)!;
      assert.equal(section.quiz.length, 10, `${number}`);
    }
  });

  test('every question has the right number of options and exactly one correct answer', () => {
    for (const section of module01.sections) {
      for (const q of section.quiz) {
        const expected = q.format === 'true_false' ? 2 : 4;
        assert.equal(
          q.options.length,
          expected,
          `${section.number}/${q.id}: a ${q.format ?? 'multiple_choice'} question takes ${expected} options`,
        );
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

  test('a true/false question, if one is ever authored, carries two options', () => {
    // Nothing in Module 1 uses this format today. The schema and the
    // validator still understand it, so this keeps that path honest rather
    // than letting it rot until the next time a quiz needs it.
    for (const section of module01.sections) {
      for (const q of section.quiz.filter((q) => q.format === 'true_false')) {
        assert.deepEqual(q.options.map((o) => o.text), ['True', 'False'], `${q.id}: bad labels`);
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

  test('no section is left on a short placeholder quiz', () => {
    const short = module01.sections.filter((r) => r.quiz.length < 10).map((r) => r.number);
    assert.deepEqual(short, []);
  });

  test('every question is attributed to the section it is drawn from', () => {
    // Review questions carry the number of the section they test, not the one
    // they appear in, which is what makes spaced repetition traceable.
    const numbers = new Set(module01.sections.map((s) => s.number));
    for (const section of module01.sections) {
      for (const q of section.quiz) {
        assert.ok(numbers.has(q.source), `${section.number}/${q.id}: unknown source ${q.source}`);
      }
    }
  });
});

describe('every section can be delivered as a lesson', () => {
  /*
   * The lesson is the same five-card shape for all eight sections now, so
   * each one has to carry what that shape needs. A section that renders an
   * empty video card and an empty transcript is a dead screen, and the only
   * honest way to catch that is to assert it here rather than to click
   * through eight pages.
   */
  test('every section has words to show, filmed or not', () => {
    for (const section of module01.sections) {
      const { text } = sectionTranscript(section);
      assert.ok(text.length > 200, `${section.number}: only ${text.length} characters to show`);
    }
  });

  test('a section with no film falls back to its script, not to nothing', () => {
    for (const section of module01.sections.filter((s) => !s.videoUrl)) {
      const { text, isFinal } = sectionTranscript(section);
      assert.equal(isFinal, false, `${section.number}: claims a final transcript without a film`);
      assert.ok(text.includes('\n\n'), `${section.number}: script did not assemble into paragraphs`);
    }
  });

  test('the words are reported as final only when a transcript was stored', () => {
    /*
     * Being filmed is not the same as having a transcript. 1.2 has a cut but
     * no transcript of it, so what the panel shows is still the shooting
     * script and it correctly labels itself "Script". This asserts the label
     * tracks the stored transcript rather than the presence of a film, which
     * is what an earlier version of this test got wrong.
     */
    for (const section of module01.sections) {
      assert.equal(
        sectionTranscript(section).isFinal,
        Boolean(section.transcript),
        `${section.number}: label does not match what is stored`,
      );
    }
  });

  test('every section reports a believable runtime', () => {
    for (const section of module01.sections) {
      const minutes = sectionMinutes(section);
      assert.ok(minutes >= 1, `${section.number}: ${minutes} min`);
      assert.ok(minutes <= 10, `${section.number}: ${minutes} min is too long for one section`);
    }
  });

  test('1.1 reports the three minutes its finished cut actually runs', () => {
    // The published rev55 cut is 2:54. If the estimator drifts away from the
    // one section we can check against reality, it is wrong about the rest.
    const section = module01.sections.find((s) => s.id === 'm1-s1')!;
    assert.equal(sectionMinutes(section), 3);
  });

  test('every section has a quiz to follow the film', () => {
    for (const section of module01.sections) {
      assert.ok(section.quiz.length > 0, `${section.number}: no questions`);
    }
  });
});

describe('knowledge checks', () => {
  /*
   * A check sits between two parts of a film. It is formative — it exists to
   * make the learner retrieve what they just watched before more arrives —
   * so it is deliberately not part of `section.quiz` and must not reach the
   * score.
   */
  test('check questions are not part of the section quiz', () => {
    for (const section of module01.sections) {
      const quizIds = new Set(section.quiz.map((q) => q.id));
      for (const check of sectionChecks(section)) {
        assert.equal(
          quizIds.has(check.id),
          false,
          `${section.number}/${check.id}: a check question is also in the graded quiz`,
        );
      }
    }
  });

  test('a check only ever follows a part that is not the last', () => {
    // A check after the final part is just the quiz with a different name.
    for (const section of module01.sections) {
      const parts = section.videoParts ?? [];
      if (parts.length === 0) continue;
      assert.ok(
        !parts[parts.length - 1]?.check?.length,
        `${section.number}: the last part carries a check`,
      );
    }
  });

  test('check questions are well formed, like any other question', () => {
    for (const section of module01.sections) {
      for (const q of sectionChecks(section)) {
        const expected = q.format === 'true_false' ? 2 : 4;
        assert.equal(q.options.length, expected, `${q.id}: wrong option count`);
        assert.equal(q.options.filter((o) => o.correct).length, 1, `${q.id}: not one correct`);
        for (const o of q.options) {
          assert.ok(o.feedback.length > 0, `${q.id}/${o.id}: no feedback`);
        }
      }
    }
  });

  test('1.3 checks the learner between its two parts', () => {
    const section = module01.sections.find((s) => s.number === '1.3')!;
    assert.equal(sectionVideos(section).length, 2);
    assert.ok(sectionChecks(section).length > 0, '1.3 has no knowledge check');
  });
});

describe('transcripts', () => {
  test('a filmed lesson stores its transcript', () => {
    const section = module01.sections.find((r) => r.id === 'm1-s1')!;
    assert.ok(section.transcript, '1.1 has no transcript');
  });

  test('1.1’s transcript opens and closes on the lines that were recorded', () => {
    // Guards against a well-meaning reflow trimming the top or tail.
    const transcript = module01.sections.find((r) => r.id === 'm1-s1')!.transcript!;
    assert.match(transcript, /^Congratulations on your promotion\./);
    assert.match(transcript, /Let's keep going\.$/);
  });

  test('1.1’s transcript names all three myths', () => {
    const transcript = module01.sections.find((r) => r.id === 'm1-s1')!.transcript!;
    for (const myth of ['Myth #1', 'Myth #2', 'Myth #3']) {
      assert.ok(transcript.includes(myth), `transcript is missing ${myth}`);
    }
  });
});

describe('video wiring', () => {
  test('no two lessons point at the same file, counting every part', () => {
    const owners = new Map<string, string>();
    for (const section of module01.sections) {
      for (const url of sectionVideos(section)) {
        const first = owners.get(url);
        assert.equal(first, undefined, `${section.number} duplicates a file on ${first}`);
        owners.set(url, section.number);
      }
    }
  });

  test('every wired film is a direct URL, not a share page', () => {
    for (const section of module01.sections) {
      for (const url of sectionVideos(section)) {
        // The extension is read off the path: a signed URL carries its token
        // in the query, so the last characters are never the file type.
        assert.match(
          new URL(url).pathname,
          /\.(mp4|m3u8|webm)$/,
          `${section.number}: not a direct video URL`,
        );
      }
    }
  });

  test('a section does not set both videoUrl and videoParts', () => {
    // One of them would be silently ignored.
    for (const section of module01.sections) {
      assert.ok(
        !(section.videoUrl && section.videoParts?.length),
        `${section.number}: sets both`,
      );
    }
  });

  test('multi-part films are listed in running order', () => {
    // The part number in the filename is the authority — the revision numbers
    // do not order them, and 1.3's parts were handed over back to front.
    for (const section of module01.sections) {
      const parts = sectionVideos(section);
      if (parts.length < 2) continue;
      parts.forEach((url, i) => {
        assert.match(
          url,
          new RegExp(`part-${i + 1}-`),
          `${section.number}: file at position ${i + 1} is not part ${i + 1}`,
        );
      });
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
