import { findSection } from '@nms/content';
import type { Contact, Enrollment, UpdateLevel } from '../registration/types.js';
import { contactsAtLevel, contactsAtOrAbove } from '../registration/rules.js';
import type { LearnerProgress } from '../progress/types.js';
import { daysSinceStart } from '../progress/engine.js';
import { evaluateInactivity, type InactivityState } from './inactivity.js';
import {
  templateGenerator,
  type CoachingQuestion,
  type CoachingQuestionGenerator,
} from './coaching-questions.js';

/**
 * Turns progress into the messages the spec says each contact should receive.
 *
 * This module decides *what* to send and *to whom*. It does not send anything
 * — no transport, no templating engine, no I/O — so the rules stay unit
 * testable and the same decisions drive email, push, and the in-app Corner
 * view without three copies of the logic.
 */

export type NotificationKind = 'section-complete' | 'weekly-digest' | 'inactivity-alert';

export interface Notification {
  kind: NotificationKind;
  to: Contact;
  enrollmentId: string;
  /** Subject line, already written. */
  subject: string;
  /** Ordered body blocks. Renderers decide typography, not content. */
  body: NotificationBlock[];
  /** The level that caused this to be sent. Absent for inactivity alerts, which ignore level. */
  triggeredByLevel?: UpdateLevel;
}

export type NotificationBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'stat'; label: string; value: string }
  | { type: 'list'; title: string; items: string[] }
  | { type: 'questions'; title: string; questions: CoachingQuestion[] }
  | { type: 'note'; text: string };

// ---------------------------------------------------------------------------
// Level 1 — real-time, per section
// ---------------------------------------------------------------------------

/**
 * Fired when a learner completes a Section. Level 1 contacts only: Level 2 and 3
 * contacts get the same information rolled into their weekly digest, and
 * double-sending is the fastest way to get a busy HR contact to filter us.
 */
export function sectionCompleteNotifications(
  enrollment: Enrollment,
  sectionId: string,
): Notification[] {
  const section = findSection(sectionId);
  if (!section) return [];

  return contactsAtLevel(enrollment, 1).map((contact) => ({
    kind: 'section-complete' as const,
    to: contact,
    enrollmentId: enrollment.id,
    triggeredByLevel: 1 as UpdateLevel,
    subject: `${firstName(enrollment.student.name)} finished ${section.number} — ${section.title}`,
    body: [
      {
        type: 'paragraph',
        text: `${enrollment.student.name} just completed Section ${section.number}, “${section.title}”.`,
      },
      { type: 'stat', label: 'Key idea', value: section.keyIdea },
    ],
  }));
}

// ---------------------------------------------------------------------------
// Level 2 and 3 — weekly digest
// ---------------------------------------------------------------------------

export interface WeeklyDigestInput {
  enrollment: Enrollment;
  progress: LearnerProgress;
  /** Inclusive start of the digest week. */
  weekStart: Date;
  /** Exclusive end of the digest week. */
  weekEnd: Date;
  /** Quiz questions answered incorrectly this week. Level 3 only. */
  missedQuestionIds?: readonly string[];
  generator?: CoachingQuestionGenerator;
}

/**
 * Builds the weekly digest for every Level 2 and Level 3 contact.
 *
 * The levels are cumulative, so this assembles the Level 2 body once and
 * appends the Level 3 section for those contacts — rather than maintaining two
 * digest templates that will drift apart by the third sprint.
 */
export function weeklyDigestNotifications(input: WeeklyDigestInput): Notification[] {
  const { enrollment, progress, weekStart, weekEnd, missedQuestionIds = [] } = input;
  const generator = input.generator ?? templateGenerator;
  const recipients = contactsAtOrAbove(enrollment, 2);
  if (recipients.length === 0) return [];

  const completedThisWeek = Object.values(progress.sections)
    .filter((r) => r.completedAt && r.completedAt >= weekStart && r.completedAt < weekEnd)
    .sort((a, b) => (a.completedAt!.getTime() - b.completedAt!.getTime()));

  const scoredThisWeek = Object.values(progress.sections).flatMap((r) =>
    r.attempts
      .filter((a) => a.at >= weekStart && a.at < weekEnd)
      .map((a) => ({ ...a, sectionId: r.sectionId })),
  );

  const name = firstName(enrollment.student.name);
  const days = daysSinceStart(progress, weekEnd);

  const level2Body: NotificationBlock[] = [];

  if (completedThisWeek.length === 0) {
    level2Body.push({
      type: 'paragraph',
      text: `${name} did not complete any sections this week.`,
    });
  } else {
    level2Body.push({
      type: 'list',
      title: `Completed this week (${completedThisWeek.length})`,
      items: completedThisWeek.map((r) => {
        const section = findSection(r.sectionId);
        return section ? `${section.number} — ${section.title}` : r.sectionId;
      }),
    });
  }

  if (scoredThisWeek.length > 0) {
    level2Body.push({
      type: 'list',
      title: 'Quiz scores',
      items: scoredThisWeek.map((a) => {
        const section = findSection(a.sectionId);
        const label = section ? `${section.number} ${section.title}` : a.sectionId;
        const attemptNote = a.passed ? 'passed' : 'not yet passed';
        return `${label}: ${a.score}% (${a.correctCount}/${a.questionCount}, ${attemptNote})`;
      }),
    });
  }

  level2Body.push({ type: 'stat', label: 'Days since starting', value: String(days) });
  level2Body.push({
    type: 'stat',
    label: 'Current streak',
    value: progress.streak.current === 1 ? '1 day' : `${progress.streak.current} days`,
  });

  return recipients.map((contact) => {
    const body = [...level2Body];

    if (contact.level === 3) {
      const questions = generator.generate({
        completedSectionIds: completedThisWeek.map((r) => r.sectionId),
        missedQuestionIds,
        max: 3,
      });
      if (questions.length > 0) {
        body.push({ type: 'questions', title: `Worth asking ${name} this week`, questions });
        body.push({
          type: 'note',
          text: `These come from the lessons ${name} covered this week and the questions they got wrong. Ask them as openers, not as a test.`,
        });
      }
    }

    return {
      kind: 'weekly-digest' as const,
      to: contact,
      enrollmentId: enrollment.id,
      triggeredByLevel: contact.level,
      subject: `${name}’s week: ${completedThisWeek.length} section${
        completedThisWeek.length === 1 ? '' : 's'
      } completed`,
      body,
    };
  });
}

// ---------------------------------------------------------------------------
// Inactivity — every contact, every level
// ---------------------------------------------------------------------------

export interface InactivityNotificationInput {
  enrollment: Enrollment;
  lastActivityAt: Date;
  now: Date;
  lastAlertSentAt?: Date;
  businessDays?: Parameters<typeof evaluateInactivity>[0]['businessDays'];
}

/**
 * Returns an alert for EVERY contact on the enrollment when one is due,
 * regardless of level — "sent independently of a contact's normal cadence.
 * A Level 2/3 contact who only expects a weekly digest still gets this
 * immediately when triggered."
 *
 * There is deliberately no level filter in this function. If a future change
 * needs one, it needs a spec change first.
 */
export function inactivityNotifications(
  input: InactivityNotificationInput,
): { notifications: Notification[]; state: InactivityState } {
  const state = evaluateInactivity({
    lastActivityAt: input.lastActivityAt,
    now: input.now,
    lastAlertSentAt: input.lastAlertSentAt,
    businessDays: input.businessDays,
  });

  if (!state.due) return { notifications: [], state };

  const name = firstName(input.enrollment.student.name);
  const repeat = state.alertsDueSoFar > 1;

  const notifications: Notification[] = input.enrollment.contacts.map((contact) => ({
    kind: 'inactivity-alert' as const,
    to: contact,
    enrollmentId: input.enrollment.id,
    subject: repeat
      ? `Still no activity from ${name}`
      : `${name} hasn’t been active in ${state.businessDaysInactive} business days`,
    body: [
      {
        type: 'paragraph',
        text: `${input.enrollment.student.name} has had no activity on their manager training for ${state.businessDaysInactive} business days.`,
      },
      ...(repeat
        ? [
            {
              type: 'paragraph' as const,
              text: `This is alert ${state.alertsDueSoFar}. We will keep checking every 7 business days until they pick it back up.`,
            },
          ]
        : []),
      {
        type: 'note',
        text: 'Opening a section counts as activity — they do not have to finish one to reset this.',
      },
    ],
  }));

  return { notifications, state };
}

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}
