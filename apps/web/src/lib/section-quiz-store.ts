import type { ActivityEventRow, QuizAttemptRow, SectionQuizSink } from '@nms/core';

/**
 * Browser-storage sink for section quiz rows.
 *
 * There is no database in this project yet: no schema, no migrations, no
 * client, no auth to hang a learner id on. So the rows the lesson page
 * produces land in localStorage, keyed by section, in exactly the shape the
 * `quiz_attempts` and `activity_events` tables expect.
 *
 * This is a staging area, not a substitute. It is per-browser and per-device,
 * it tells a contact's digest nothing, and clearing site data wipes it. What
 * it does buy: XP and attempt counts survive a refresh, "first attempt only"
 * means something across sessions, and when a real table arrives the swap is
 * one `SectionQuizSink` implementation with no change to the page.
 *
 * Every read and write is wrapped: Safari in private mode throws on access
 * rather than returning null, and a quiz that cannot be taken because storage
 * is unavailable would be a worse failure than a quiz that cannot be
 * remembered.
 */

const ATTEMPTS_KEY = 'nms.quiz_attempts';
const EVENTS_KEY = 'nms.activity_events';
/** Keeps the event log from growing without bound in a long-lived browser. */
const MAX_EVENTS = 500;

function read<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, rows: T[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(rows));
  } catch {
    // Storage full, blocked, or private mode. The quiz still works.
  }
}

export function readAttempts(): QuizAttemptRow[] {
  return read<QuizAttemptRow>(ATTEMPTS_KEY);
}

export function readEvents(): ActivityEventRow[] {
  return read<ActivityEventRow>(EVENTS_KEY);
}

/** Attempts already recorded for one section, used to number the next one. */
export function attemptsForSection(sectionId: string): QuizAttemptRow[] {
  return readAttempts().filter((row) => row.scope === 'section' && row.section_id === sectionId);
}

export const browserSink: SectionQuizSink = {
  recordAttempt(row: QuizAttemptRow) {
    write(ATTEMPTS_KEY, [...readAttempts(), row]);
  },
  recordEvent(row: ActivityEventRow) {
    const rows = [...readEvents(), row];
    write(EVENTS_KEY, rows.slice(-MAX_EVENTS));
  },
};
