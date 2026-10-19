import {
  test,
  expect,
  fetchSection,
  correctIndex,
  wrongIndex,
  answerCard,
  checksOf,
  readStore,
} from './support';

/**
 * 1.3: a film delivered in two parts, with a knowledge check between them.
 *
 * The assertion that matters most is the last one. A check is formative — it
 * exists to make the learner retrieve what they just watched before more
 * arrives — so it must not reach the score. Answering one wrong and still
 * finishing on 100% is the only way to prove that from outside.
 */

const SECTION_ID = 'm1-s3';

test.describe('two-part section', () => {
  test('parts are labelled, ordered, and gated by the check between them', async ({
    lessonPage,
  }) => {
    const section = await fetchSection(lessonPage, SECTION_ID);
    const checks = checksOf(section);
    expect(checks.length, 'a check between the parts').toBeGreaterThan(0);

    await lessonPage.goto(`/learn/${SECTION_ID}`);
    await expect(lessonPage.locator('[data-card="open"]')).toBeVisible();

    // Only part 1 exists until the check is answered.
    await expect(lessonPage.locator('[data-card="video"]')).toHaveCount(1);
    const partOne = lessonPage.locator('[data-card="video"]').first();
    await expect(partOne).toContainText(/part 1 of 2/i);
    await expect(partOne.locator('video')).toHaveAttribute('src', /part-1-rev19/);

    await expect(lessonPage.locator('[data-card="check"]')).toHaveCount(1);
    for (const [i, question] of checks.entries()) {
      await expect(lessonPage.locator('[data-card="check"]').nth(i)).toContainText(/quick check/i);
      await answerCard(lessonPage, 'check', i, correctIndex(question));
    }

    const partTwo = lessonPage.locator('[data-card="video"]').nth(1);
    await expect(partTwo).toContainText(/part 2 of 2/i);
    await expect(partTwo.locator('video')).toHaveAttribute('src', /part-2-rev25/);
  });

  test('a multi-part section still offers its script', async ({ lessonPage }) => {
    // This was broken: the toggle was keyed off `section.videoUrl`, which a
    // section delivered in parts does not have, so the script was unreachable.
    await lessonPage.goto(`/learn/${SECTION_ID}`);
    await expect(
      lessonPage.getByRole('button', { name: /^(transcript|script)/i }).first(),
    ).toBeVisible();
  });

  test('each part card has its own panel id', async ({ lessonPage }) => {
    const section = await fetchSection(lessonPage, SECTION_ID);
    await lessonPage.goto(`/learn/${SECTION_ID}`);
    for (const [i, question] of checksOf(section).entries()) {
      await answerCard(lessonPage, 'check', i, correctIndex(question));
    }
    const ids = await lessonPage.evaluate(() =>
      [...document.querySelectorAll('[id^="transcript-"]')].map((el) => el.id),
    );
    // Duplicated ids make aria-controls point at whichever came first.
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('a wrong knowledge-check answer does not touch the quiz score', async ({ lessonPage }) => {
    const section = await fetchSection(lessonPage, SECTION_ID);
    const checks = checksOf(section);

    await lessonPage.goto(`/learn/${SECTION_ID}`);
    // First check wrong, on purpose.
    await answerCard(lessonPage, 'check', 0, wrongIndex(checks[0]!));
    await expect(lessonPage.locator('[data-card="check"]').first()).toContainText(/not quite/i);
    for (let i = 1; i < checks.length; i++) {
      await answerCard(lessonPage, 'check', i, correctIndex(checks[i]!));
    }

    for (const [i, question] of section.quiz.entries()) {
      await answerCard(lessonPage, 'quiz', i, correctIndex(question));
    }

    const result = lessonPage.locator('[data-card="result"]');
    await result.scrollIntoViewIfNeeded();
    await expect(result).toContainText('100%');
    await expect(result).toContainText(`${section.quiz.length} of ${section.quiz.length} correct`);

    const attempts = await readStore<{ score_pct: number }>(lessonPage, 'nms.quiz_attempts');
    expect(attempts[0]?.score_pct).toBe(100);

    // The check answers are still logged — formative, not invisible.
    const events = await readStore<{ type: string; question_id?: string; correct?: boolean }>(
      lessonPage,
      'nms.activity_events',
    );
    const checkEvents = events.filter((e) => checks.some((c) => c.id === e.question_id));
    expect(checkEvents).toHaveLength(checks.length);
    expect(checkEvents.filter((e) => e.correct === true)).toHaveLength(checks.length - 1);
  });
});
