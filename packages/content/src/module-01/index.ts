import type { CourseModule } from '../types.js';
import { rep01 } from './rep-01.js';
import { rep02 } from './rep-02.js';
import { rep03 } from './rep-03.js';
import { rep04 } from './rep-04.js';
import { rep05 } from './rep-05.js';
import { rep06 } from './rep-06.js';
import { rep07 } from './rep-07.js';
import { rep08 } from './rep-08.js';

/**
 * Module 1 — The Mindset Shift: From Doer to Manager.
 * The MVP. Eight Reps, all from the approved & locked April 2026 script.
 */
export const module01: CourseModule = {
  id: 'm1',
  number: 1,
  title: 'The Mindset Shift',
  subtitle: 'From Doer to Manager',
  description:
    'The seven shifts that have to happen in your head before any management technique will work. Why your best skills now work against you, what changes about your relationships, and how to read what each person needs from you.',
  status: 'live',
  // 85% to match the midterm and final exam thresholds in the course outline.
  passingScore: 85,
  reps: [rep01, rep02, rep03, rep04, rep05, rep06, rep07, rep08],
};

export { rep01, rep02, rep03, rep04, rep05, rep06, rep07, rep08 };
