import { test as base, expect } from '@playwright/test';
import {
  blockVideoRequests,
  fetchSection,
  correctIndex,
  answerCard,
  readStore,
  COACH_STORAGE_KEY,
} from './support';

/**
 * The coach picker, and what switching costs.
 *
 * Deliberately does NOT use the seeded-coach fixture: half of what is being
 * tested is what happens to a learner who has not chosen one.
 */

const test = base.extend({});

test.beforeEach(async ({ page }) => {
  await blockVideoRequests(page);
});

test.describe('picking a coach', () => {
  test('a learner with no coach is sent to the picker and back again', async ({ page }) => {
    await page.goto('/learn/m1-s1');
    await expect(page).toHaveURL(/\/coach\?next=%2Flearn%2Fm1-s1/);

    await expect(page.locator('[data-coach]')).toHaveCount(4);
    for (const name of ['Steve', 'Jordan', 'Riley', 'Elena']) {
      await expect(page.locator('[data-coach]').filter({ hasText: name })).toHaveCount(1);
    }
    // `alex` is the stable key behind Steve. It must never surface as copy.
    await expect(page.locator('body')).not.toContainText('Alex');

    const brokenPortraits = await page.evaluate(
      () =>
        [...document.querySelectorAll('[data-coach] img')].filter(
          (img) => !(img as HTMLImageElement).complete || (img as HTMLImageElement).naturalWidth === 0,
        ).length,
    );
    expect(brokenPortraits).toBe(0);

    await page.locator('[data-coach="jordan"]').click();
    await page.getByRole('button', { name: /start with jordan/i }).click();

    await expect(page).toHaveURL(/\/learn\/m1-s1$/);
    await expect(page.locator('video').first()).toHaveAttribute('src', /-Jordan\.mp4$/);
    await expect(page.locator('body')).toContainText('Coach: Jordan');
  });

  test('a learner who has chosen is never asked again', async ({ page }) => {
    await page.addInitScript(
      ([key]) => window.localStorage.setItem(key, 'elena'),
      [COACH_STORAGE_KEY] as const,
    );
    await page.goto('/learn/m1-s1');
    await expect(page).toHaveURL(/\/learn\/m1-s1$/);
    await expect(page.locator('video').first()).toHaveAttribute('src', /-Elena\.mp4$/);
  });

  test('a section with no coach cuts plays the film it always played', async ({ page }) => {
    await page.addInitScript(
      ([key]) => window.localStorage.setItem(key, 'jordan'),
      [COACH_STORAGE_KEY] as const,
    );
    await page.goto('/learn/m1-s2');
    const section = await fetchSection(page, 'm1-s2');
    await expect(page.locator('video').first()).toHaveAttribute('src', section.videoUrl!);
    // Nothing to change, so nothing offering to change it.
    await expect(page.locator('body')).not.toContainText('Coach:');
  });

  test('?next= cannot be used to bounce off-site', async ({ page }) => {
    await page.goto('/coach?next=https://example.com/evil');
    await page.locator('[data-coach="riley"]').click();
    await page.getByRole('button', { name: /start with riley/i }).click();
    await expect(page).toHaveURL(/^http:\/\/localhost:3000\//);
  });

  test('both the first pick and the switch are recorded', async ({ page }) => {
    // With a ?next=, so the learner lands on a lesson — which is the only
    // surface that carries the coach header and the Change control.
    await page.goto('/coach?next=%2Flearn%2Fm1-s1');
    await page.locator('[data-coach="jordan"]').click();
    await page.getByRole('button', { name: /start with jordan/i }).click();
    await expect(page.locator('body')).toContainText('Coach: Jordan');

    await page.getByRole('button', { name: 'Change' }).click();
    await page.locator('[data-coach="elena"]').click();
    await page.getByRole('button', { name: /start with elena/i }).click();
    await expect(page.locator('body')).toContainText('Coach: Elena');

    const picks = (
      await readStore<{ type: string; coach_key?: string; previous_coach_key?: string }>(
        page,
        'nms.activity_events',
      )
    ).filter((e) => e.type === 'coach_selected');

    expect(picks).toHaveLength(2);
    expect(picks[0]).toMatchObject({ coach_key: 'jordan' });
    expect(picks[0]?.previous_coach_key).toBeUndefined();
    // Which coach people leave matters as much as which they arrive at.
    expect(picks[1]).toMatchObject({ coach_key: 'elena', previous_coach_key: 'jordan' });
  });
});

test.describe('switching costs no progress', () => {
  const switchTo = async (page: Parameters<typeof blockVideoRequests>[0], key: string, name: string) => {
    await page.getByRole('button', { name: 'Change' }).click();
    await page.locator(`[data-coach="${key}"]`).click();
    await page.getByRole('button', { name: new RegExp(`start with ${name}`, 'i') }).click();
    await expect(page.locator('body')).toContainText(`Coach: ${name}`);
  };

  test('answers given before a switch survive it', async ({ page }) => {
    await page.addInitScript(
      ([key]) => window.localStorage.setItem(key, 'alex'),
      [COACH_STORAGE_KEY] as const,
    );
    await page.goto('/learn/m1-s1');
    const section = await fetchSection(page, 'm1-s1');

    for (let i = 0; i < 4; i++) {
      await answerCard(page, 'quiz', i, correctIndex(section.quiz[i]!));
    }
    await expect(page.locator('[class*="chromeCount"]')).toContainText('4/10');

    await switchTo(page, 'riley', 'Riley');

    await expect(page.locator('[class*="optionCorrect"]')).toHaveCount(4);
    await expect(page.locator('[class*="chromeCount"]')).toContainText('4/10');
    // The gate has not moved either.
    await expect(page.locator('[data-card="quiz"]')).toHaveCount(5);
    await expect(page.locator('video').first()).toHaveAttribute('src', /-Riley\.mp4$/);
  });

  test('a finished section stays finished, and records no extra attempt', async ({ page }) => {
    await page.addInitScript(
      ([key]) => window.localStorage.setItem(key, 'alex'),
      [COACH_STORAGE_KEY] as const,
    );
    await page.goto('/learn/m1-s1');
    const section = await fetchSection(page, 'm1-s1');

    for (const [i, question] of section.quiz.entries()) {
      await answerCard(page, 'quiz', i, correctIndex(question));
    }
    await page.locator('[data-card="apply"]').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: /i'll do this/i }).click();

    const before = await readStore(page, 'nms.quiz_attempts');
    await switchTo(page, 'elena', 'Elena');

    const result = page.locator('[data-card="result"]');
    await expect(result).toContainText('100%');
    await expect(result).toContainText('+50 XP');
    await expect(page.locator('[class*="optionCorrect"]')).toHaveCount(section.quiz.length);
    await expect(page.locator('[data-card="apply"]')).toContainText(/committed/i);

    const after = await readStore(page, 'nms.quiz_attempts');
    expect(after).toHaveLength(before.length);
    expect(await readStore(page, 'nms.apply_commitments')).toHaveLength(1);
  });

  test('the new film starts from the beginning', async ({ page }) => {
    await page.addInitScript(
      ([key]) => window.localStorage.setItem(key, 'alex'),
      [COACH_STORAGE_KEY] as const,
    );
    await page.goto('/learn/m1-s1');
    await switchTo(page, 'jordan', 'Jordan');
    // A different file has nowhere else to resume from.
    expect(await page.locator('video').first().evaluate((v: HTMLVideoElement) => v.currentTime)).toBe(0);
  });
});
