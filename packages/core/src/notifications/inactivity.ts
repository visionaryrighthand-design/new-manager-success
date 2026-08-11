import {
  addBusinessDays,
  businessDaysBetween,
  toCalendarDate,
  type BusinessDayOptions,
  type CalendarDate,
} from '../time/business-days.js';

/**
 * Inactivity alert — § 3 of the Registration & Progress Communications spec.
 *
 *   Trigger: fires when a student has had no activity for 7 business days.
 *   Reset:   any activity resets the clock — opening a section, submitting an
 *            answer, or completing one (not completions only).
 *   Repeat:  if the student remains inactive, the alert fires again every
 *            7 business days until activity resumes.
 *   Scope:   sent independently of a contact's normal cadence. A Level 2/3
 *            contact who only expects a weekly digest still gets this
 *            immediately when triggered.
 *
 * The "Scope" line is the one most likely to be lost in implementation, so it
 * is expressed here as a hard invariant: this module knows nothing about
 * update levels at all. It cannot suppress by level because it never sees one.
 */

export const INACTIVITY_THRESHOLD_BUSINESS_DAYS = 7;

export interface InactivityInput {
  /** Most recent activity of ANY kind. See RESETS_INACTIVITY. */
  lastActivityAt: Date;
  now: Date;
  /** When the most recent inactivity alert was sent, if any. */
  lastAlertSentAt?: Date;
  businessDays?: BusinessDayOptions;
}

export interface InactivityState {
  /** True when an alert is due right now. */
  due: boolean;
  /** Business days elapsed since the last activity. */
  businessDaysInactive: number;
  /** Calendar date the next alert falls due. */
  nextAlertDate: CalendarDate;
  /**
   * How many alerts should have been sent by now for this dry spell, counting
   * from the first. Lets a caller detect a missed run and avoid double-sending.
   */
  alertsDueSoFar: number;
}

/**
 * Evaluates the inactivity rule for one learner.
 *
 * Pure and idempotent: call it as often as you like. Deciding whether to
 * actually send is the caller's job, using `due` together with
 * `lastAlertSentAt` — which is why the repeat schedule is anchored to the last
 * *activity*, not the last *alert*. Anchoring to the alert would let a delayed
 * send push the whole schedule out, so a system outage on a Tuesday would
 * quietly move every subsequent alert for that learner.
 */
export function evaluateInactivity(input: InactivityInput): InactivityState {
  const opts = input.businessDays ?? {};
  const tz = opts.timeZone ?? 'UTC';

  const lastActivity = toCalendarDate(input.lastActivityAt, tz);
  const today = toCalendarDate(input.now, tz);
  const businessDaysInactive = businessDaysBetween(lastActivity, today, opts);

  const alertsDueSoFar = Math.floor(businessDaysInactive / INACTIVITY_THRESHOLD_BUSINESS_DAYS);

  const nextAlertDate = addBusinessDays(
    lastActivity,
    (alertsDueSoFar + 1) * INACTIVITY_THRESHOLD_BUSINESS_DAYS,
    opts,
  );

  if (alertsDueSoFar === 0) {
    return { due: false, businessDaysInactive, nextAlertDate, alertsDueSoFar };
  }

  // An alert is due if we have not yet sent one for this threshold crossing.
  const alertsAlreadySent = input.lastAlertSentAt
    ? // Alerts sent before the last activity belong to a previous dry spell.
      toCalendarDate(input.lastAlertSentAt, tz) >= lastActivity
      ? Math.floor(
          businessDaysBetween(lastActivity, toCalendarDate(input.lastAlertSentAt, tz), opts) /
            INACTIVITY_THRESHOLD_BUSINESS_DAYS,
        )
      : 0
    : 0;

  return {
    due: alertsDueSoFar > alertsAlreadySent,
    businessDaysInactive,
    nextAlertDate,
    alertsDueSoFar,
  };
}
