/**
 * Which contact roles the picker offers, per entry point.
 *
 * Straight from the flowchart. "Registering myself" offers
 * "No one / Their boss / HR / Someone else" — there is no "Me", because the
 * registrant is already the student and would be emailing themselves.
 * Both "someone else" branches add "Me".
 *
 * This is not cosmetic: a self-registered learner who ends up as their own
 * contact would receive a Level 1 email every time they finish a Rep they
 * just finished.
 */
export function allowedContactRoles(entry) {
    return entry === 'self'
        ? ['boss', 'hr', 'other']
        : ['boss', 'hr', 'other', 'registrant'];
}
/** Human labels for the picker, matching the flowchart's wording. */
export const contactRoleLabels = {
    boss: 'Their boss',
    hr: 'HR',
    other: 'Someone else',
    registrant: 'Me',
};
/** Labels shown when the learner is registering themselves. */
export const selfContactRoleLabels = {
    boss: 'My boss',
    hr: 'HR',
    other: 'Someone else',
};
export const updateLevelSummary = {
    1: {
        name: 'Basic',
        cadence: 'Real-time, per section',
        contents: 'A notification each time they complete a section.',
    },
    2: {
        name: 'Intermediate',
        cadence: 'Weekly digest',
        contents: 'Sections completed that week, test and quiz scores, and a running total of days since they started.',
    },
    3: {
        name: 'Advanced',
        cadence: 'Weekly digest',
        contents: 'Everything in Level 2, plus suggested questions to ask them in your next one-to-one.',
    },
};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/**
 * Validates one enrollment against the flowchart's rules.
 * Returns an empty array when the enrollment can be saved.
 */
export function validateEnrollment(enrollment) {
    const problems = [];
    const { entry, student, contacts, registeredBy } = enrollment;
    if (!student.name.trim())
        problems.push({ field: 'student.name', message: 'Student name is required.' });
    if (!EMAIL.test(student.email)) {
        problems.push({ field: 'student.email', message: 'Student email is not valid.' });
    }
    if (entry !== 'self' && !registeredBy) {
        problems.push({
            field: 'registeredBy',
            message: 'Registering someone else requires the registrant’s own details.',
        });
    }
    if (entry === 'other-group' && !enrollment.rosterId) {
        problems.push({ field: 'rosterId', message: 'Group registrations must belong to a roster.' });
    }
    const allowed = allowedContactRoles(entry);
    const seenEmails = new Set([student.email.trim().toLowerCase()]);
    contacts.forEach((contact, i) => {
        const at = `contacts[${i}]`;
        if (!contact.name.trim())
            problems.push({ field: `${at}.name`, message: 'Contact name is required.' });
        if (!EMAIL.test(contact.email)) {
            problems.push({ field: `${at}.email`, message: 'Contact email is not valid.' });
        }
        if (!allowed.includes(contact.role)) {
            problems.push({
                field: `${at}.role`,
                message: `Role "${contact.role}" is not offered when ${entry === 'self' ? 'registering yourself' : 'registering someone else'}.`,
            });
        }
        if (![1, 2, 3].includes(contact.level)) {
            problems.push({ field: `${at}.level`, message: 'Each contact must be assigned exactly one level: 1, 2, or 3.' });
        }
        const email = contact.email.trim().toLowerCase();
        if (seenEmails.has(email)) {
            problems.push({
                field: `${at}.email`,
                message: email === student.email.trim().toLowerCase()
                    ? 'A student cannot be their own progress contact.'
                    : 'This address is already a contact on this enrollment.',
            });
        }
        seenEmails.add(email);
    });
    return problems;
}
/**
 * Derives the business category from § 4 of the spec.
 *
 *   Registering myself → No one .................. self-directed
 *   Registering myself → contact(s) added ........ manager-visibility
 *   Someone else → one person .................... manager-visibility
 *   Someone else → group ......................... compliance-bulk
 *
 * Note the asymmetry: a group registration stays `compliance-bulk` even when
 * an individual student in it has no contacts of their own.
 */
export function categorize(enrollment) {
    if (enrollment.entry === 'other-group')
        return 'compliance-bulk';
    if (enrollment.entry === 'other-individual')
        return 'manager-visibility';
    return enrollment.contacts.length === 0 ? 'self-directed' : 'manager-visibility';
}
export const categoryLabels = {
    'self-directed': {
        title: 'Self-directed',
        description: 'No visibility to anyone else.',
    },
    'manager-visibility': {
        title: 'Manager visibility',
        description: 'A boss, HR, or another contact follows an individual’s progress.',
    },
    'compliance-bulk': {
        title: 'Compliance / bulk',
        description: 'Typically HR or L&D enrolling several people at once. Each student can still have their own contacts and levels — for example, each new manager’s own supervisor.',
    },
};
/** Contacts on this enrollment at a given level. */
export function contactsAtLevel(enrollment, level) {
    return enrollment.contacts.filter((c) => c.level === level);
}
/**
 * Contacts at or above a level. Useful because the levels are cumulative:
 * a Level 3 contact also receives everything a Level 2 contact receives, so
 * digest assembly asks for `level >= 2` rather than `level === 2`.
 */
export function contactsAtOrAbove(enrollment, level) {
    return enrollment.contacts.filter((c) => c.level >= level);
}
//# sourceMappingURL=rules.js.map