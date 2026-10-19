/**
 * The coaches.
 *
 * Same script, same quiz, same everything — a different person delivering it.
 * The choice is cosmetic to the curriculum and significant to the learner,
 * which is the whole point: a manager who is panicking and a manager who
 * needs a push are not helped by the same voice.
 *
 * ── On the keys ───────────────────────────────────────────────────────────
 *
 * `alex` displays as **Steve**. The key and the name differ on purpose: the
 * key is the stable identifier that routes, stored profiles and video maps
 * are written against, and renaming it would orphan every learner who had
 * already chosen. A display name is copy and can change; a key cannot.
 *
 * Note for anyone reading this expecting `alex` to be pre-existing: it was
 * not in this repository. There was no coach concept here at all. The key is
 * named `alex` to match whatever system does already use it.
 */

export type CoachKey = 'alex' | 'jordan' | 'riley' | 'elena';

export interface Coach {
  key: CoachKey;
  /** What the learner sees. Copy, not an identifier. */
  name: string;
  /**
   * One line on the picker. One.
   *
   * The picker is a choice between four people, not four paragraphs — a
   * learner choosing a presenter is making a gut call in about four seconds,
   * and a bio turns that into homework.
   */
  line: string;
  /** Still, shown on the picker card. Served from the web app's public dir. */
  poster: string;
}

export const COACHES: readonly Coach[] = [
  {
    key: 'alex',
    name: 'Steve',
    line: "Steady and measured. The one you want when you're panicking.",
    poster: '/coaches/alex.webp',
  },
  {
    key: 'jordan',
    name: 'Jordan',
    line: 'Direct, with energy. The one you want when you need a push.',
    poster: '/coaches/jordan.webp',
  },
  {
    key: 'riley',
    name: 'Riley',
    line: 'Warm and relatable. The one you want when you need to be understood.',
    poster: '/coaches/riley.webp',
  },
  {
    key: 'elena',
    name: 'Elena',
    line: 'Calm and senior. The one you want when something has actually gone wrong.',
    poster: '/coaches/elena.webp',
  },
];

export const COACH_KEYS: readonly CoachKey[] = COACHES.map((c) => c.key);

export function findCoach(key: string | null | undefined): Coach | undefined {
  return COACHES.find((c) => c.key === key);
}

/** Narrows an arbitrary stored string — localStorage can hold anything. */
export function isCoachKey(value: unknown): value is CoachKey {
  return typeof value === 'string' && COACH_KEYS.includes(value as CoachKey);
}
