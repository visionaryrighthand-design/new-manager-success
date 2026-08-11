import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  course,
  feedCards,
  isInteractive,
  repCadence,
  contentAdditions,
  fieldNotePrompt,
  module01,
  validateContent,
  estimateRepTotalSeconds,
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

/**
 * Both players typeset build-list items and moments from these two parsers, so
 * a wrong split shows up as a design bug on two platforms at once. The cases
 * that matter are the ones where the punctuation looks like structure and is
 * not — the scripts use em dashes as prose throughout.
 */
describe('build-list parsing', () => {
  test('pulls the label out of a colon-prefixed item', () => {
    const { label, body, quoted } = splitListItem(
      'Myth #1: \u201cI\u2019ll just do what my old manager did.\u201d',
    );
    assert.equal(label, 'Myth #1');
    assert.equal(body, 'I\u2019ll just do what my old manager did.');
    assert.equal(quoted, true);
  });

  test('keeps a label\u2019s own em dash in the body', () => {
    const { label, body } = splitListItem(
      'Level 1: Unable and Unsure \u2014 new to the task. Needs clear direction.',
    );
    assert.equal(label, 'Level 1');
    assert.equal(body, 'Unable and Unsure \u2014 new to the task. Needs clear direction.');
  });

  test('does not invent a label from an em dash', () => {
    const { label, body } = splitListItem(
      'In a small business \u2014 every single one of these hits harder.',
    );
    assert.equal(label, undefined);
    assert.equal(body, 'In a small business \u2014 every single one of these hits harder.');
  });

  test('does not treat a sentence ending in a colon-less full stop as a label', () => {
    assert.equal(splitListItem('Productivity drops. Conflict increases.').label, undefined);
  });

  test('leaves an item containing two quotations quoted in place', () => {
    const { body, quoted } = splitListItem(
      '\u201cFriendly\u201d is not \u201cfriendship\u201d',
    );
    assert.equal(quoted, false);
    assert.ok(body.startsWith('\u201cFriendly\u201d'));
  });

  test('every Module 1 item survives a round trip', () => {
    for (const rep of module01.reps) {
      for (const beat of rep.beats) {
        for (const item of beat.items ?? []) {
          const { label, body } = splitListItem(item);
          const rejoined = label ? `${label}: ${body}` : body;
          // Quotes are stripped for the renderer to hang, so compare without them.
          const stripped = item.replace(/[\u201c\u201d"]/g, '');
          assert.equal(
            rejoined.replace(/[\u201c\u201d"]/g, ''),
            stripped,
            `${rep.number}/${beat.id}: "${item}" did not round trip`,
          );
        }
      }
    }
  });
});

describe('moment parsing', () => {
  test('separates the payoff sentence from the setup', () => {
    assert.deepEqual(
      splitMomentLines('Employees don\u2019t quit companies. They quit managers.'),
      ['Employees don\u2019t quit companies.', 'They quit managers.'],
    );
  });

  test('leaves a single-sentence moment whole', () => {
    const one = 'You can\u2019t manage others effectively until you can manage yourself first.';
    assert.deepEqual(splitMomentLines(one), [one]);
  });

  test('no Module 1 moment loses a word to the split', () => {
    for (const rep of module01.reps) {
      for (const beat of rep.beats) {
        if (beat.type !== 'moment' || !beat.text) continue;
        assert.equal(
          splitMomentLines(beat.text).join(' ').replace(/\s+/g, ' '),
          beat.text.trim().replace(/\s+/g, ' '),
          `${rep.number}/${beat.id} lost text`,
        );
      }
    }
  });
});

describe('media wiring', () => {
  const mediaUrls = () =>
    module01.reps.flatMap((rep) =>
      rep.beats.flatMap((beat) =>
        [beat.audioUrl, beat.videoUrl]
          .filter((u): u is string => Boolean(u))
          .map((url) => ({ where: `${rep.number}/${beat.id}`, url })),
      ),
    );

  test('no two beats point at the same media file', () => {
    const owners = new Map<string, string>();
    const clashes: string[] = [];
    for (const { where, url } of mediaUrls()) {
      const first = owners.get(url);
      if (first) clashes.push(`${where} duplicates ${first}`);
      else owners.set(url, where);
    }
    assert.deepEqual(clashes, []);
  });

  test('every wired file is a direct URL, not a share page', () => {
    for (const { where, url } of mediaUrls()) {
      // The extension has to be read off the path, not the whole string: a
      // signed URL carries the token in the query, so the last characters are
      // never the file type. What this is actually rejecting is a link to a
      // player page, which has no media extension in its path at all.
      const path = new URL(url).pathname;
      assert.match(
        path,
        /\.(mp3|m4a|aac|wav|ogg|mp4|m3u8)$/,
        `${where}: not a direct media URL`,
      );
    }
  });

  test('an audio file is named after the beat it plays on', () => {
    // Four video files were once wired in named some variant of "From Solo
    // Star to Team Leader," and picking the right one from that list was a
    // coin flip. The take id is the filename; this keeps it that way.
    for (const rep of module01.reps) {
      for (const beat of rep.beats) {
        if (!beat.audioUrl) continue;
        const file = decodeURIComponent(new URL(beat.audioUrl).pathname).split('/').pop();
        assert.equal(
          file,
          `${rep.id}-${beat.id}.mp3`,
          `${rep.number}/${beat.id}: file is "${file}"`,
        );
      }
    }
  });

  test('a reading beat is never given a voiceover — it is silent by design', () => {
    for (const rep of module01.reps) {
      for (const beat of rep.beats) {
        if (beat.type !== 'reading') continue;
        assert.equal(
          beat.audioUrl,
          undefined,
          `${rep.number}/${beat.id}: reading cards are read, not narrated`,
        );
      }
    }
  });

  test('Module 1 ships no talking-head footage', () => {
    // The pilot moved to cards with voiceover. If a video is ever wired back
    // in it should be a deliberate choice with a note next to it, not a
    // leftover — so this fails loudly rather than drifting.
    const withVideo = module01.reps.flatMap((rep) =>
      rep.beats.filter((b) => b.videoUrl).map((b) => `${rep.number}/${b.id}`),
    );
    assert.deepEqual(withVideo, []);
  });
});

describe('cadence', () => {
  /*
   * Why this is a test and not just a report: the whole reason Gut Checks
   * exist is that Rep 1.5 ran nine cards and 2m25 with no input, and nobody
   * noticed until it was measured. A regression here is content drifting back
   * to a document, which nothing else in the suite would catch.
   */
  /** Above this, a run of cards reads as homework. */
  const COMFORTABLE_SECONDS = 90;

  test('a Rep with Gut Checks holds under 90 seconds of unbroken reading', () => {
    for (const rep of module01.reps) {
      if (!rep.gutChecks?.length) continue;
      const { longestPassiveSeconds } = repCadence(rep);
      assert.ok(
        longestPassiveSeconds <= COMFORTABLE_SECONDS,
        `${rep.number}: longest passive run is ${longestPassiveSeconds}s`,
      );
    }
  });

  test('a Rep with Gut Checks opens within four cards of its first input', () => {
    for (const rep of module01.reps) {
      if (!rep.gutChecks?.length) continue;
      const first = feedCards(rep).findIndex(isInteractive);
      assert.ok(
        first >= 0 && first <= 4,
        `${rep.number}: ${first} cards before the learner does anything`,
      );
    }
  });

  /*
   * A ratchet, not a pass mark.
   *
   * Five Reps still run over 90 seconds of unbroken reading; only 1.1 and 1.5
   * have been reworked so far. Pinning the exact list means a Rep cannot
   * quietly regress into it, and fixing one forces this line to be edited —
   * so the backlog lives in the suite rather than in somebody's memory.
   *
   * When this list is empty, replace this test with the unconditional bar.
   */
  test('the Reps still over the comfortable bar are exactly the ones we know about', () => {
    const over = module01.reps
      .filter((rep) => repCadence(rep).longestPassiveSeconds > COMFORTABLE_SECONDS)
      .map((rep) => rep.number);
    assert.deepEqual(over, ['1.2', '1.3', '1.4', '1.6', '1.7']);
  });

  test('a Gut Check lands before a Curveball triggered on the same beat', () => {
    // The cheap interruption first — stacking the expensive one ahead of it
    // buries it behind a decision the learner is still thinking about.
    for (const rep of module01.reps) {
      const cards = feedCards(rep);
      for (let i = 0; i < cards.length - 1; i++) {
        if (cards[i]!.kind === 'curveball' && cards[i + 1]!.kind === 'gutCheck') {
          assert.fail(`${rep.number}: Gut Check follows a Curveball on the same beat`);
        }
      }
    }
  });
});

describe('provenance', () => {
  test('every Gut Check is declared as a content addition', () => {
    for (const rep of module01.reps) {
      if (!rep.gutChecks?.length) continue;
      const declared = (rep.contentAdditions ?? []).filter((a) => a.kind === 'gut-check');
      assert.equal(
        declared.length,
        rep.gutChecks.length,
        `${rep.number}: ${rep.gutChecks.length} Gut Checks but ${declared.length} declared`,
      );
    }
  });

  test('nothing added to a locked script is marked approved yet', () => {
    // Additions ship as `proposed` until the author signs them off. If this
    // starts failing, someone approved them — which is fine, but should be a
    // deliberate edit rather than a default.
    for (const addition of contentAdditions()) {
      assert.equal(
        addition.status,
        'proposed',
        `${addition.ref}: marked ${addition.status} without a recorded sign-off`,
      );
    }
  });

  test('a Gut Check never grades the learner', () => {
    for (const rep of module01.reps) {
      for (const gc of rep.gutChecks ?? []) {
        for (const choice of gc.choices) {
          assert.ok(choice.reaction.length > 0, `${gc.id}/${choice.id}: no reaction`);
          assert.doesNotMatch(
            choice.reaction,
            /\b(correct|incorrect|wrong answer|that's wrong)\b/i,
            `${gc.id}/${choice.id}: reads as grading an answer that cannot be wrong`,
          );
        }
      }
    }
  });
});

describe('Field Note follow-ups', () => {
  /*
   * The point of a Curveball is that it is a decision, and a decision that
   * costs nothing is a quiz with better copy. The follow-up is where the
   * choice comes back, so these guard the property that makes it work: every
   * answer leads somewhere, and the somewhere is different per answer.
   */
  const withFollowUps = module01.reps.filter((r) => r.fieldNote.followUps?.length);

  test('every Curveball choice has its own follow-up, not just the best one', () => {
    for (const rep of withFollowUps) {
      for (const curveball of rep.curveballs) {
        const covered = (rep.fieldNote.followUps ?? [])
          .filter((f) => f.curveballId === curveball.id)
          .map((f) => f.choiceId)
          .sort();
        if (covered.length === 0) continue;
        assert.deepEqual(
          covered,
          curveball.choices.map((c) => c.id).sort(),
          `${rep.number}/${curveball.id}: partial coverage reads as a bug to whoever picked the uncovered option`,
        );
      }
    }
  });

  test('no two choices lead to the same prompt', () => {
    for (const rep of withFollowUps) {
      const prompts = (rep.fieldNote.followUps ?? []).map((f) => f.prompt);
      assert.equal(new Set(prompts).size, prompts.length, `${rep.number}: duplicate follow-up prompt`);
    }
  });

  test('a learner who answered gets their own prompt; one who skipped gets the default', () => {
    const rep = module01.reps.find((r) => r.number === '1.1')!;
    const answered = fieldNotePrompt(rep, { 'm1-r1-cb1': 'a' });
    const skipped = fieldNotePrompt(rep, {});

    assert.equal(answered.followedUp, true);
    assert.match(answered.prompt, /absorb the extra work/i);
    assert.equal(skipped.followedUp, false);
    assert.equal(skipped.prompt, rep.fieldNote.prompt);
  });

  test('an unrecognised choice falls back rather than throwing', () => {
    const rep = module01.reps.find((r) => r.number === '1.1')!;
    const result = fieldNotePrompt(rep, { 'm1-r1-cb1': 'zzz' });
    assert.equal(result.followedUp, false);
    assert.equal(result.prompt, rep.fieldNote.prompt);
  });

  test('a follow-up refers back to the decision rather than restating the lesson', () => {
    // The whole effect depends on the learner recognising their own answer.
    for (const rep of withFollowUps) {
      for (const followUp of rep.fieldNote.followUps ?? []) {
        assert.match(
          followUp.prompt,
          /^Earlier you/,
          `${rep.number}/${followUp.choiceId}: does not open by naming what they chose`,
        );
      }
    }
  });
});
