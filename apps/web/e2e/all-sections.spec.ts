import {
  test,
  expect,
  fetchSection,
  correctIndex,
  answerCard,
  checksOf,
  videoUrlsOf,
  readStore,
  completeSection,
} from './support';

/**
 * Every section of Module 1, played start to finish.
 *
 * Breadth rather than depth. The other suites go deep on 1.1; this one
 * asserts that the other seven are not quietly broken — which is the failure
 * mode of a product where one section gets all the attention. A section with
 * no film must still be a usable lesson, and a section nobody has looked at
 * in weeks must still reach its result card.
 */

const SECTION_IDS = ['m1-s1', 'm1-s2', 'm1-s3', 'm1-s4', 'm1-s5', 'm1-s6', 'm1-s7', 'm1-s8'];

for (const sectionId of SECTION_IDS) {
  test(`${sectionId} plays end to end`, async ({ lessonPage }) => {
    const pageErrors: string[] = [];
    lessonPage.on('pageerror', (error) => pageErrors.push(String(error)));

    const section = await fetchSection(lessonPage, sectionId);
    const response = await lessonPage.goto(`/learn/${sectionId}`);
    expect(response?.status()).toBe(200);

    /* Cold open: populated, and honest about what it is asking for. */
    const open = lessonPage.locator('[data-card="open"]');
    await expect(open).toBeVisible();
    await expect(open).toContainText(/swipe up/i);
    await expect(open).toContainText(/\d+\s*min/i);
    await expect(open).toContainText(String(section.quiz.length));

    /* Watch: a film, or the script in its place. Never an empty frame. */
    const videos = videoUrlsOf(section);
    const videoCard = lessonPage.locator('[data-card="video"]').first();
    if (videos.length > 0) {
      await expect(lessonPage.locator('video').first()).toHaveAttribute('src', videos[0]!);
      const label = section.transcript ? /^transcript/i : /^script/i;
      await expect(lessonPage.getByRole('button', { name: label }).first()).toBeVisible();
    } else {
      await expect(lessonPage.locator('video')).toHaveCount(0);
      await expect(videoCard).toContainText(/not filmed yet/i);
      // The fallback has to be the lesson, not an apology.
      const text = await videoCard.innerText();
      expect(text.replace(/\s+/g, ' ').length).toBeGreaterThan(400);
    }

    /* Practice: checks gate the parts behind them, then the quiz. */
    await completeSection(lessonPage, section);
    if (checksOf(section).length > 0) {
      await expect(lessonPage.locator('[data-card="video"]')).toHaveCount(videos.length);
    }
    await expect(lessonPage.locator('[data-card="quiz"]')).toHaveCount(section.quiz.length);

    /* Result: a perfect run scores 100 and records exactly one attempt. */
    const result = lessonPage.locator('[data-card="result"]');
    await result.scrollIntoViewIfNeeded();
    await expect(result).toContainText('100%');
    await expect(result).toContainText('+50 XP');

    const attempts = await readStore<{ scope: string; section_id: string }>(
      lessonPage,
      'nms.quiz_attempts',
    );
    expect(attempts).toHaveLength(1);
    expect(attempts[0]).toMatchObject({ scope: 'section', section_id: sectionId });

    /* Apply and Reinforce close the lesson, and only the last one exits. */
    await expect(lessonPage.locator('[data-card="apply"]')).toHaveCount(1);
    const reinforce = lessonPage.locator('[data-card="reinforce"]');
    await reinforce.scrollIntoViewIfNeeded();
    const next = reinforce.getByRole('link', { name: /next section/i });
    await expect(next).toHaveCount(sectionId === 'm1-s8' ? 0 : 1);

    expect(pageErrors, `console errors on ${sectionId}`).toEqual([]);
  });
}

test('every section carries ten questions and an Apply task', async ({ lessonPage }) => {
  // Cheap, and it fails loudly the moment a section is published short.
  for (const sectionId of SECTION_IDS) {
    const section = await fetchSection(lessonPage, sectionId);
    expect(section.quiz, `${sectionId} quiz length`).toHaveLength(10);
    expect(section.apply, `${sectionId} apply task`).toBeTruthy();
  }
});
