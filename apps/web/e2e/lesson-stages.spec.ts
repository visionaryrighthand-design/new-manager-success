import { test, expect, fetchSection, correctIndex, answerCard, readStore } from './support';

/**
 * Watch → Practice → Apply → Reinforce.
 *
 * The order assertion here is the important one. Apply and Reinforce were
 * built, shipped, and never seen by anyone, because the result card two
 * cards earlier carried the "Next section" link — so the obvious thing to
 * tap left the lesson before the last two stages existed on screen.
 */

const SECTION_ID = 'm1-s1';

test.describe('the four stages', () => {
  test.beforeEach(async ({ lessonPage }) => {
    await lessonPage.goto(`/learn/${SECTION_ID}`);
    await expect(lessonPage.locator('[data-card="open"]')).toBeVisible();
  });

  test('each stage is named on the card it belongs to', async ({ lessonPage }) => {
    await expect(lessonPage.locator('[data-card="video"]')).toContainText(/watch/i);
    const section = await fetchSection(lessonPage, SECTION_ID);
    await answerCard(lessonPage, 'quiz', 0, correctIndex(section.quiz[0]!));
    await expect(lessonPage.locator('[data-card="quiz"]').first()).toContainText(/practice · 1 of/i);
  });

  test('the lesson ends result → apply → reinforce, and exits only at the end', async ({
    lessonPage,
  }) => {
    const section = await fetchSection(lessonPage, SECTION_ID);
    for (const [i, question] of section.quiz.entries()) {
      await answerCard(lessonPage, 'quiz', i, correctIndex(question));
    }

    const order = await lessonPage.evaluate(() =>
      [...document.querySelectorAll('[data-card]')].map((el) => (el as HTMLElement).dataset.card),
    );
    expect(order.slice(-3)).toEqual(['result', 'apply', 'reinforce']);

    const result = lessonPage.locator('[data-card="result"]');
    await result.scrollIntoViewIfNeeded();
    // The regression this file exists for.
    await expect(result.getByRole('link', { name: /next section/i })).toHaveCount(0);
    await expect(result.getByRole('button', { name: 'Try again' })).toBeVisible();
    await expect(result).toContainText(/now put it to work/i);

    const reinforce = lessonPage.locator('[data-card="reinforce"]');
    await reinforce.scrollIntoViewIfNeeded();
    const next = reinforce.getByRole('link', { name: /next section/i });
    await expect(next).toBeVisible();
    await expect(next).toHaveAttribute('href', '/learn/m1-s2');
  });

  test('Apply states a real task and records the commitment', async ({ lessonPage }) => {
    const section = await fetchSection(lessonPage, SECTION_ID);
    for (const [i, question] of section.quiz.entries()) {
      await answerCard(lessonPage, 'quiz', i, correctIndex(question));
    }

    const apply = lessonPage.locator('[data-card="apply"]');
    await apply.scrollIntoViewIfNeeded();
    await expect(apply).toContainText(/apply · at work/i);
    await expect(apply).toContainText(section.apply!.title);
    await expect(apply).toContainText(/done properly means/i);
    for (const marker of section.apply!.lookFor) {
      await expect(apply).toContainText(marker);
    }

    await lessonPage.getByRole('button', { name: /i'll do this/i }).click();
    await expect(apply).toContainText(/committed/i);

    const commitments = await readStore<{ section_id: string; due_in_days: number }>(
      lessonPage,
      'nms.apply_commitments',
    );
    expect(commitments).toHaveLength(1);
    expect(commitments[0]).toMatchObject({
      section_id: SECTION_ID,
      due_in_days: section.apply!.withinDays,
    });
  });

  test('Reinforce says what comes back and who will ask', async ({ lessonPage }) => {
    const section = await fetchSection(lessonPage, SECTION_ID);
    for (const [i, question] of section.quiz.entries()) {
      await answerCard(lessonPage, 'quiz', i, correctIndex(question));
    }

    const reinforce = lessonPage.locator('[data-card="reinforce"]');
    await reinforce.scrollIntoViewIfNeeded();
    await expect(reinforce).toContainText(/reinforce · later/i);
    await expect(reinforce).toContainText(/working days/i);
    // Knowing a person will ask is the part that changes behaviour, so it is
    // shown rather than held back as a surprise.
    await expect(reinforce).toContainText(section.apply!.managerPrompt);
  });

  test('a commitment survives a reload', async ({ lessonPage }) => {
    const section = await fetchSection(lessonPage, SECTION_ID);
    for (const [i, question] of section.quiz.entries()) {
      await answerCard(lessonPage, 'quiz', i, correctIndex(question));
    }
    await lessonPage.locator('[data-card="apply"]').scrollIntoViewIfNeeded();
    await lessonPage.getByRole('button', { name: /i'll do this/i }).click();

    await lessonPage.reload();
    const commitments = await readStore(lessonPage, 'nms.apply_commitments');
    expect(commitments).toHaveLength(1);
  });
});
