/**
 * Registration model — a direct encoding of the flowchart in
 * "Registration & Progress Communications" / "Onboarding Workflow —
 * Developer Reference".
 *
 * The single most important line in that spec:
 *
 *   "'someone else / one person' and the per-student loop inside 'group' use
 *    the identical contact-selection component — only the entry point differs.
 *    Build it once, reuse it in both places."
 *
 * So `ContactSelection` below is one type used in all three branches, and
 * `Enrollment` is one shape regardless of how registration started. The entry
 * point is recorded as data, not expressed as three different structures.
 */

/** Where the registration started. The only thing that differs per branch. */
export type RegistrationEntry =
  /** "Registering myself" — registrant IS the student. */
  | 'self'
  /** "Registering someone else" → "One person". */
  | 'other-individual'
  /** "Registering someone else" → "Group". */
  | 'other-group';

/**
 * Who a contact is to the student. Drawn verbatim from the flowchart's
 * multi-select options.
 *
 * `registrant` is the flowchart's "Me" option. It is only offered when the
 * registrant is not the student — see `allowedContactRoles`.
 */
export type ContactRole = 'boss' | 'hr' | 'other' | 'registrant';

/**
 * Update level. Cumulative:
 *   1 — real-time notification per completed section
 *   2 — weekly digest: sections completed, quiz scores, days since start
 *   3 — everything in 2, plus suggested 1:1 questions
 *
 * Each contact gets exactly one level. A student may have several contacts on
 * different levels.
 */
export type UpdateLevel = 1 | 2 | 3;

export interface Person {
  name: string;
  email: string;
}

export interface Contact extends Person {
  id: string;
  role: ContactRole;
  level: UpdateLevel;
}

/** The output of the shared contact-selection component. */
export interface ContactSelection {
  /** Empty means the flowchart's "No one" branch. */
  contacts: Contact[];
}

export interface Enrollment {
  id: string;
  entry: RegistrationEntry;
  student: Person;
  contacts: Contact[];
  /** Present for `other-individual` and `other-group`. */
  registeredBy?: Person;
  /** Groups all students enrolled in one `other-group` submission. */
  rosterId?: string;
  startedAt: Date;
}

/**
 * Business categories from the spec's § 4 "Category reference".
 * Context for reporting and pricing — explicitly "not a build step", so it is
 * derived from the enrollment rather than stored on it.
 */
export type EnrollmentCategory = 'self-directed' | 'manager-visibility' | 'compliance-bulk';
