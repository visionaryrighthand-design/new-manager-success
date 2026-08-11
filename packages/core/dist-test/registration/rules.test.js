import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { allowedContactRoles, categorize, contactsAtOrAbove, validateEnrollment } from './rules.js';
const student = { name: 'Dana Reyes', email: 'dana@example.com' };
const registrant = { name: 'Sam Okafor', email: 'sam@example.com' };
const contact = (over = {}) => ({
    id: 'c1',
    name: 'Lee Park',
    email: 'lee@example.com',
    role: 'boss',
    level: 1,
    ...over,
});
const enrollment = (over = {}) => ({
    id: 'e1',
    entry: 'self',
    student,
    contacts: [],
    startedAt: new Date('2026-08-10T09:00:00Z'),
    ...over,
});
describe('allowedContactRoles', () => {
    test('self-registration does not offer "Me"', () => {
        const roles = allowedContactRoles('self');
        assert.deepEqual([...roles], ['boss', 'hr', 'other']);
        assert.equal(roles.includes('registrant'), false);
    });
    test('registering someone else offers "Me"', () => {
        for (const entry of ['other-individual', 'other-group']) {
            assert.equal(allowedContactRoles(entry).includes('registrant'), true);
        }
    });
});
describe('validateEnrollment', () => {
    test('a self-directed enrollment with no contacts is valid', () => {
        assert.deepEqual(validateEnrollment(enrollment()), []);
    });
    test('a student cannot be their own contact', () => {
        const problems = validateEnrollment(enrollment({ contacts: [contact({ email: student.email })] }));
        assert.equal(problems.length, 1);
        assert.match(problems[0].message, /cannot be their own progress contact/);
    });
    test('the same contact address cannot be added twice', () => {
        const problems = validateEnrollment(enrollment({
            contacts: [contact({ id: 'c1' }), contact({ id: 'c2', role: 'hr', level: 2 })],
        }));
        assert.equal(problems.length, 1);
        assert.match(problems[0].message, /already a contact/);
    });
    test('the "Me" role is rejected on a self-registration', () => {
        const problems = validateEnrollment(enrollment({ contacts: [contact({ role: 'registrant' })] }));
        assert.equal(problems.length, 1);
        assert.match(problems[0].message, /not offered when registering yourself/);
    });
    test('registering someone else requires the registrant', () => {
        const problems = validateEnrollment(enrollment({ entry: 'other-individual' }));
        assert.equal(problems.some((p) => p.field === 'registeredBy'), true);
    });
    test('a group registration must belong to a roster', () => {
        const problems = validateEnrollment(enrollment({ entry: 'other-group', registeredBy: registrant }));
        assert.equal(problems.some((p) => p.field === 'rosterId'), true);
    });
    test('an invalid level is rejected', () => {
        const problems = validateEnrollment(
        // Cast: the point of the test is to reject data arriving from an untyped source.
        enrollment({ contacts: [contact({ level: 4 })] }));
        assert.equal(problems.some((p) => /exactly one level/.test(p.message)), true);
    });
    test('a group student may carry their own contacts at their own levels', () => {
        // Explicitly called out in the spec: "each student can still have their own
        // contact(s) and level; for example, each new manager's own supervisor."
        const problems = validateEnrollment(enrollment({
            entry: 'other-group',
            registeredBy: registrant,
            rosterId: 'r1',
            contacts: [
                contact({ id: 'c1', email: 'lee@example.com', role: 'boss', level: 3 }),
                contact({ id: 'c2', email: 'hr@example.com', role: 'hr', level: 1 }),
                contact({ id: 'c3', email: registrant.email, role: 'registrant', level: 2 }),
            ],
        }));
        assert.deepEqual(problems, []);
    });
});
describe('categorize', () => {
    test('registering myself with no contacts is self-directed', () => {
        assert.equal(categorize({ entry: 'self', contacts: [] }), 'self-directed');
    });
    test('registering myself with contacts is manager-visibility', () => {
        assert.equal(categorize({ entry: 'self', contacts: [contact()] }), 'manager-visibility');
    });
    test('registering one other person is manager-visibility', () => {
        assert.equal(categorize({ entry: 'other-individual', contacts: [] }), 'manager-visibility');
    });
    test('a group stays compliance-bulk even when a student has no contacts', () => {
        assert.equal(categorize({ entry: 'other-group', contacts: [] }), 'compliance-bulk');
    });
});
describe('contactsAtOrAbove', () => {
    test('level 3 contacts also receive level 2 content, because levels are cumulative', () => {
        const e = enrollment({
            contacts: [
                contact({ id: 'c1', email: 'a@example.com', level: 1 }),
                contact({ id: 'c2', email: 'b@example.com', level: 2 }),
                contact({ id: 'c3', email: 'c@example.com', level: 3 }),
            ],
        });
        assert.deepEqual(contactsAtOrAbove(e, 2).map((c) => c.id), ['c2', 'c3']);
    });
});
//# sourceMappingURL=rules.test.js.map