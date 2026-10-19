import { test as base, expect, type Page } from '@playwright/test';
import type { CoachKey, QuizQuestion, Section } from '@nms/content';

/**
 * Shared setup for the lesson suites.
 *
 * Two things every lesson test needs, and one thing it must never do.
 *
 * **Never fetch the films.** They are hosted on Supabase, which this build
 * environment cannot reach and CI has no business hitting either: a test
 * suite that depends on somebody's storage bucket fails for reasons that
 * have nothing to do with the code. Requests for `.mp4` are aborted, which
 * leaves a real <video> element with a real `src` — exactly what the
 * assertions are about — that simply never loads bytes.
 *
 * **Seed a coach.** Every Module 1 section redirects to the picker when no
 * coach has been chosen. A suite that is testing the lesson should start
 * inside the lesson; the redirect itself is covered by the coach suite.
 */

export const COACH_STORAGE_KEY = 'nms.coach_key';

export async function blockVideoRequests(page: Page): Promise<void> {
  await page.route('**/*.mp4*', (route) => route.abort());
}

export async function seedCoach(page: Page, coach = 'alex'): Promise<void> {
  await page.addInitScript(
    ([key, value]) => window.localStorage.setItem(key, value),
    [COACH_STORAGE_KEY, coach] as const,
  );
}

/** The section as the app itself serves it — the content is the authority. */
export async function fetchSection(page: Page, sectionId: string): Promise<Section> {
  const response = await page.request.get(`/api/sections/${sectionId}`);
  expect(response.ok(), `GET /api/sections/${sectionId}`).toBe(true);
  const body = (await response.json()) as { section?: Section } & Section;
  return body.section ?? body;
}

/** Index of the correct option, for driving a question without hardcoding answers. */
export function correctIndex(question: QuizQuestion): number {
  return question.options.findIndex((option) => option.correct);
}

/** Any wrong option, for exercising the feedback path. */
export function wrongIndex(question: QuizQuestion): number {
  return question.options.findIndex((option) => !option.correct);
}

/** The knowledge-check questions that sit between a section's film parts. */
export function checksOf(section: Section): QuizQuestion[] {
  return (section.videoParts ?? []).flatMap((part) => part.check ?? []);
}

/**
 * The files a given learner actually sees, in order.
 *
 * Mirrors the app's resolution — videos[coach] → videoUrl — because a helper
 * that only read `videoUrl` would assert 1.1 plays the pre-coach cut and
 * fail against correct behaviour.
 */
export function videoUrlsOf(section: Section, coach: CoachKey = 'alex'): string[] {
  if (section.videoParts?.length) return section.videoParts.map((part) => part.url);
  const url = section.videos?.[coach] ?? section.videoUrl;
  return url ? [url] : [];
}

/** Answers one card of a given kind and waits for the feed to settle. */
export async function answerCard(
  page: Page,
  kind: 'quiz' | 'check',
  index: number,
  optionIndex: number,
): Promise<void> {
  const card = page.locator(`[data-card="${kind}"]`).nth(index);
  await card.scrollIntoViewIfNeeded();
  await card.locator('button').nth(optionIndex).click();
  // The next card is revealed by state, not by a network call, so there is
  // nothing to await but the render. `.first()` because the verdict block
  // and its heading and body all carry a class containing "verdict", and a
  // multi-match locator is a strict-mode violation rather than a wait.
  await expect(card.locator('[class*="verdict"]').first()).toBeVisible();
}

/** Plays a section's checks then its whole quiz, correctly. */
export async function completeSection(page: Page, section: Section): Promise<void> {
  for (const [i, question] of checksOf(section).entries()) {
    await answerCard(page, 'check', i, correctIndex(question));
  }
  for (const [i, question] of section.quiz.entries()) {
    await answerCard(page, 'quiz', i, correctIndex(question));
  }
}

export async function readStore<T>(page: Page, key: string): Promise<T[]> {
  return page.evaluate((k) => JSON.parse(window.localStorage.getItem(k) || '[]'), key);
}

/**
 * A page that is already inside the lesson: films blocked, coach chosen.
 */
export const test = base.extend<{ lessonPage: Page }>({
  lessonPage: async ({ page }, use) => {
    await blockVideoRequests(page);
    await seedCoach(page);
    await use(page);
  },
});

export { expect };
