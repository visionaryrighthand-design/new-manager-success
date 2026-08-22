import type { CourseModule } from '../types.js';
import { section01 } from './section-01.js';
import { section02 } from './section-02.js';
import { section03 } from './section-03.js';
import { section04 } from './section-04.js';
import { section05 } from './section-05.js';
import { section06 } from './section-06.js';
import { section07 } from './section-07.js';
import { section08 } from './section-08.js';

/**
 * Module 1 — The Mindset Shift: From Doer to Manager.
 * The MVP. Eight Sections, all from the approved & locked April 2026 script.
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
  sections: [section01, section02, section03, section04, section05, section06, section07, section08],
};

export { section01, section02, section03, section04, section05, section06, section07, section08 };
