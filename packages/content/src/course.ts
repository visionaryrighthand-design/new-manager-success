import type { Course } from './types.js';
import { module01 } from './module-01/index.js';

/**
 * The full course shape. Module 1 is live; the remaining eleven come from the
 * August 2026 Expanded Module & Section Outline and are shown in-app as
 * "coming next" so pilot users can see where the programme goes.
 *
 * Status meanings:
 *   live          — scripted, built, shipping
 *   in-production — scripts drafted, not yet locked or built
 *   outlined      — section breakdown approved, not yet scripted
 */
export const course: Course = {
  id: 'new-manager-foundations',
  title: 'New Manager Foundations',
  modules: [module01],
  roadmap: [
    { number: 1, title: 'The Mindset Shift', status: 'live' },
    { number: 2, title: 'The Manager’s Voice', status: 'in-production' },
    { number: 3, title: 'Delegation Without Guilt', status: 'outlined' },
    { number: 4, title: 'Feedback is Your Superpower', status: 'outlined' },
    { number: 5, title: 'Managing Your Time, Energy, and Priorities', status: 'outlined' },
    { number: 6, title: 'Building Trust, Team Dynamics, and Leading 1:1s', status: 'outlined' },
    { number: 7, title: 'Leading Meetings That Don’t Waste Everyone’s Time', status: 'outlined' },
    { number: 8, title: 'Managing Up Without Sucking Up', status: 'outlined' },
    { number: 9, title: 'Handling Tough Conversations and Conflict', status: 'outlined' },
    { number: 10, title: 'Performance, Motivation, and Growing Your People', status: 'outlined' },
    { number: 11, title: 'HR Essentials and Hiring for New Managers', status: 'outlined' },
    { number: 12, title: 'Your First 90 Days', status: 'outlined' },
  ],
};

/** Exams from the course outline. Not built in the MVP — declared so the UI can preview them. */
export const exams = [
  {
    id: 'midterm',
    title: 'Midterm Exam',
    covers: 'Modules 1–6',
    minutes: [30, 40] as const,
    passingScore: 85,
    formats: ['scenario-based', 'multiple choice', 'reflection'],
    retakes: 'unlimited',
    gate: 'Must pass to unlock the second half of the course.',
  },
  {
    id: 'final',
    title: 'Final Exam + Certification',
    covers: 'All 12 modules',
    minutes: [45, 60] as const,
    passingScore: 85,
    formats: ['case studies', 'multiple choice', 'video-based scenarios'],
    retakes: 'unlimited',
    gate: 'Unlocks certification.',
  },
] as const;
