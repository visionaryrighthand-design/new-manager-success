import {
  test,
  expect,
  fetchSection,
  correctIndex,
  wrongIndex,
  answerCard,
  readStore,
} from './support';
import type { Section } from '@nms/content';

/**
 * The lesson feed on 1.1: the mechanics a learner swipes through.
 *
 * Several of these look pedantic and are not. The snap assertions pin
 * behaviour that, when it broke, let a fast flick skip a question entirely.
 * The transcript assertions pin a bug where an author stylesheet outranked
 * the `hidden` attribute and shipped the panel permanently open.
 */

const SECTION_ID = 'm1-s1';

test.describe('lesson feed', () => {
  let section: Section;

  test.beforeEach(async ({ lessonPage }) => {
    section = await fetchSection(lessonPage, SECTION_ID);
    await lessonPage.goto(`/learn/${SECTION_ID}`);
    await expect(lessonPage.locator('[data-card="open"]')).toBeVisible();
  });

  test('cards snap one at a time and fill the viewport', async ({ lessonPage }) => {
    const metrics = await lessonPage.evaluate(() => {
      const card = document.querySelector('[data-card="open"]') as HTMLElement;
      const feed = card.parentElement as HTMLElement;
      return {
        snapType: getComputedStyle(feed).scrollSnapType,
        snapStop: getComputedStyle(card).scrollSnapStop,
        snapAlign: getComputedStyle(card).scrollSnapAlign,
        height: Math.round(card.getBoundingClientRect().height),
      };
    });

    expect(metrics.snapType).toContain('mandatory');
    // Without `always`, a fast flick crosses several cards — which in a quiz
    // means skipping questions outright.
    expect(metrics.snapStop).toBe('always');
    expect(metrics.snapAlign).toBe('start');
    expect(metrics.height).toBe(844);
  });

  test('the cold open names all four stages', async ({ lessonPage }) => {
    const open = lessonPage.locator('[data-card="open"]');
    for (const stage of ['Watch', 'Practice', 'Apply', 'Reinforce']) {
      await expect(open).toContainText(stage, { ignoreCase: true });
    }
    await expect(open).toContainText(/swipe up/i);
  });

  test('the film is playable, inline, and never autoplays', async ({ lessonPage }) => {
    const video = lessonPage.locator('video').first();
    const attrs = await video.evaluate((element: HTMLVideoElement) => ({
      controls: element.hasAttribute('controls'),
      playsInline: element.hasAttribute('playsinline'),
      autoplay: element.hasAttribute('autoplay'),
      preload: element.getAttribute('preload'),
    }));

    expect(attrs.controls).toBe(true);
    expect(attrs.playsInline).toBe(true);
    // Muted autoplay would start the lesson before it was asked for, and an
    // unmuted one would be blocked by the browser anyway.
    expect(attrs.autoplay).toBe(false);
    // What puts the first frame on screen without a generated poster.
    expect(attrs.preload).toBe('metadata');
    // Captions are burned into the files; an overlay track would double them.
    await expect(lessonPage.locator('video track')).toHaveCount(0);
  });

  test('the transcript is collapsed until asked for, and can be closed again', async ({
    lessonPage,
  }) => {
    const panel = lessonPage.locator('[id^="transcript-"]').first();
    await expect(panel).toBeHidden();

    await lessonPage.getByRole('button', { name: /^(transcript|script)/i }).click();
    await expect(panel).toBeVisible();

    const paragraphs = await panel.locator('p').allInnerTexts();
    const body = paragraphs.join(' ').replace(/\s+/g, ' ').trim();
    expect(body.startsWith('Congratulations on your promotion.')).toBe(true);
    expect(body.endsWith("Let's keep going.")).toBe(true);

    // The sheet covers the control that opened it, so it carries its own.
    await lessonPage.getByRole('button', { name: 'Close' }).click();
    await expect(panel).toBeHidden();
    await expect(lessonPage.getByRole('button', { name: /^(transcript|script)/i })).toBeVisible();
  });

  test('the feed ends at the first unanswered question', async ({ lessonPage }) => {
    // The gate is made of absence: there is nothing to scroll to rather than
    // a disabled card to be blocked by.
    await expect(lessonPage.locator('[data-card]')).toHaveCount(3);
    await expect(lessonPage.locator('[data-card="quiz"]')).toHaveCount(1);
  });

  test('a wrong answer teaches and does not block', async ({ lessonPage }) => {
    const first = section.quiz[0]!;
    await answerCard(lessonPage, 'quiz', 0, wrongIndex(first));

    const card = lessonPage.locator('[data-card="quiz"]').first();
    await expect(card).toContainText(/not quite/i);
    // The right answer is revealed even when the learner got it wrong —
    // the quiz teaches here rather than only scoring.
    await expect(card.locator('button').nth(correctIndex(first))).toHaveClass(/optionCorrect/);
    // And the feed carries on regardless.
    await expect(lessonPage.locator('[data-card="quiz"]')).toHaveCount(2);
  });

  test('the swipe cue does not swallow taps on the card beneath it', async ({ lessonPage }) => {
    // It is absolutely positioned across the full width of the card. When it
    // took pointer events, the last option of a tall question was untappable.
    const cuePointerEvents = await lessonPage.evaluate(() => {
      const cue = document.querySelector('[data-card="video"] p[aria-hidden="true"]');
      return cue ? getComputedStyle(cue).pointerEvents : null;
    });
    expect(cuePointerEvents).toBe('none');
  });

  test('a full run scores, awards XP once, and records one attempt', async ({ lessonPage }) => {
    for (const [i, question] of section.quiz.entries()) {
      await answerCard(lessonPage, 'quiz', i, correctIndex(question));
    }

    const result = lessonPage.locator('[data-card="result"]');
    await result.scrollIntoViewIfNeeded();
    await expect(result).toContainText('100%');
    await expect(result).toContainText(`${section.quiz.length} of ${section.quiz.length} correct`);
    await expect(result).toContainText('+50 XP');

    const attempts = await readStore<{ scope: string; section_id: string; score_pct: number; attempt_number: number }>(
      lessonPage,
      'nms.quiz_attempts',
    );
    expect(attempts).toHaveLength(1);
    expect(attempts[0]).toMatchObject({
      scope: 'section',
      section_id: SECTION_ID,
      score_pct: 100,
      attempt_number: 1,
    });

    const events = await readStore<{ type: string }>(lessonPage, 'nms.activity_events');
    expect(events.filter((e) => e.type === 'answer_submit')).toHaveLength(section.quiz.length);
    expect(events.filter((e) => e.type === 'quiz_submit')).toHaveLength(1);
  });

  test('a retake resets the quiz and earns no second award', async ({ lessonPage }) => {
    for (const [i, question] of section.quiz.entries()) {
      await answerCard(lessonPage, 'quiz', i, correctIndex(question));
    }
    await lessonPage.locator('[data-card="result"]').scrollIntoViewIfNeeded();
    await lessonPage.getByRole('button', { name: 'Try again' }).click();

    await expect(lessonPage.locator('[data-card="quiz"]')).toHaveCount(1);
    await expect(lessonPage.locator('[class*="optionCorrect"]')).toHaveCount(0);

    for (const [i, question] of section.quiz.entries()) {
      await answerCard(lessonPage, 'quiz', i, correctIndex(question));
    }
    const result = lessonPage.locator('[data-card="result"]');
    await result.scrollIntoViewIfNeeded();
    await expect(result).toContainText('100%');
    // Paying for a retake would make failing on purpose the optimal strategy.
    await expect(result).not.toContainText('+50 XP');

    const attempts = await readStore<{ attempt_number: number }>(lessonPage, 'nms.quiz_attempts');
    expect(attempts.map((a) => a.attempt_number)).toEqual([1, 2]);
  });
});
