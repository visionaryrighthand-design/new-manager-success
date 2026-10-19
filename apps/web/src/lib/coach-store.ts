'use client';

import { isCoachKey, type CoachKey } from '@nms/content';
import { browserSink } from './section-quiz-store';

/**
 * The learner's chosen coach.
 *
 * The spec asks for this on the learner's profile, mirrored in localStorage.
 * There is no profile — no database, no auth, no user record anywhere in this
 * repository — so localStorage is not a mirror here, it is the only copy.
 * That means the choice is per-browser and per-device, and a learner who
 * opens the app on their laptop will be asked to choose again.
 *
 * Kept deliberately small and behind these four functions so that when a
 * profile exists, the write becomes an API call in one place and nothing
 * above this file changes.
 */

const KEY = 'nms.coach_key';

export function readCoach(): CoachKey | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    return isCoachKey(raw) ? raw : null;
  } catch {
    // Private mode, blocked storage. Treated as "not chosen yet".
    return null;
  }
}

/**
 * Records the choice and logs it.
 *
 * Logged on first pick *and* on every switch, per the spec — which coaches
 * people pick is interesting, but how often they switch is the thing that
 * tells you whether the four are actually different enough to matter.
 */
export function saveCoach(coach: CoachKey): void {
  const previous = readCoach();
  try {
    window.localStorage.setItem(KEY, coach);
  } catch {
    // The choice will not survive the session. Still better than blocking.
  }
  browserSink.recordEvent({
    type: 'coach_selected',
    module_id: 1,
    section_id: '',
    coach_key: coach,
    previous_coach_key: previous ?? undefined,
    at: new Date().toISOString(),
  });
}

export function clearCoach(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing to clear */
  }
}
