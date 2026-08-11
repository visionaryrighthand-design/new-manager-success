import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateInactivity, INACTIVITY_THRESHOLD_BUSINESS_DAYS } from './inactivity.js';
import { inactivityNotifications } from './dispatch.js';
/**
 * Reference: 2026-08-10 is a Monday.
 * 7 business days after Mon 10 Aug is Wed 19 Aug.
 */
const MON_10 = new Date('2026-08-10T09:00:00Z');
const at = (iso) => new Date(`${iso}T09:00:00Z`);
describe('evaluateInactivity — trigger', () => {
    test('the threshold is 7 business days', () => {
        assert.equal(INACTIVITY_THRESHOLD_BUSINESS_DAYS, 7);
    });
    test('not due at 6 business days', () => {
        // Mon 10 + 6 business days = Tue 18.
        const state = evaluateInactivity({ lastActivityAt: MON_10, now: at('2026-08-18') });
        assert.equal(state.businessDaysInactive, 6);
        assert.equal(state.due, false);
    });
    test('due at exactly 7 business days', () => {
        const state = evaluateInactivity({ lastActivityAt: MON_10, now: at('2026-08-19') });
        assert.equal(state.businessDaysInactive, 7);
        assert.equal(state.due, true);
        assert.equal(state.alertsDueSoFar, 1);
    });
    test('a weekend alone never triggers it', () => {
        // Fri 14 -> Mon 17 is one business day, though three calendar days passed.
        const state = evaluateInactivity({
            lastActivityAt: at('2026-08-14'),
            now: at('2026-08-17'),
        });
        assert.equal(state.businessDaysInactive, 1);
        assert.equal(state.due, false);
    });
    test('public holidays extend the window when configured', () => {
        const state = evaluateInactivity({
            lastActivityAt: MON_10,
            now: at('2026-08-19'),
            businessDays: { holidays: ['2026-08-12'] },
        });
        assert.equal(state.businessDaysInactive, 6);
        assert.equal(state.due, false, 'the holiday should not count towards the 7');
    });
});
describe('evaluateInactivity — reset', () => {
    test('any later activity clears a previously due alert', () => {
        const stale = evaluateInactivity({ lastActivityAt: MON_10, now: at('2026-08-19') });
        assert.equal(stale.due, true);
        // The learner opens a section on the 19th; the spec says opening counts.
        const reset = evaluateInactivity({
            lastActivityAt: at('2026-08-19'),
            now: at('2026-08-19'),
        });
        assert.equal(reset.businessDaysInactive, 0);
        assert.equal(reset.due, false);
    });
    test('an alert sent during a previous dry spell does not suppress a new one', () => {
        // Alerted 19 Aug, learner returned 20 Aug, then went quiet again.
        // 7 business days after Thu 20 Aug is Mon 31 Aug.
        const state = evaluateInactivity({
            lastActivityAt: at('2026-08-20'),
            now: at('2026-08-31'),
            lastAlertSentAt: at('2026-08-19'),
        });
        assert.equal(state.due, true, 'the old alert belongs to a finished dry spell');
        assert.equal(state.alertsDueSoFar, 1);
    });
});
describe('evaluateInactivity — repeat', () => {
    test('does not re-fire before the next 7 business days elapse', () => {
        const state = evaluateInactivity({
            lastActivityAt: MON_10,
            now: at('2026-08-25'),
            lastAlertSentAt: at('2026-08-19'),
        });
        // Mon 10 -> Tue 25 is 11 business days: past the first threshold, short of the second.
        assert.equal(state.alertsDueSoFar, 1);
        assert.equal(state.due, false, 'alert 1 has already been sent');
    });
    test('fires again at 14 business days', () => {
        // 14 business days after Mon 10 Aug is Fri 28 Aug.
        const state = evaluateInactivity({
            lastActivityAt: MON_10,
            now: at('2026-08-28'),
            lastAlertSentAt: at('2026-08-19'),
        });
        assert.equal(state.businessDaysInactive, 14);
        assert.equal(state.alertsDueSoFar, 2);
        assert.equal(state.due, true);
    });
    test('a missed send is detected rather than silently skipped', () => {
        // Nothing was ever sent, and the learner has been gone 21 business days.
        const state = evaluateInactivity({ lastActivityAt: MON_10, now: at('2026-09-08') });
        assert.equal(state.alertsDueSoFar, 3);
        assert.equal(state.due, true);
    });
    test('the repeat schedule is anchored to activity, not to when we sent', () => {
        // An alert delayed to the 24th must not push the second alert past Fri 28.
        const onTime = evaluateInactivity({
            lastActivityAt: MON_10,
            now: at('2026-08-28'),
            lastAlertSentAt: at('2026-08-19'),
        });
        const delayed = evaluateInactivity({
            lastActivityAt: MON_10,
            now: at('2026-08-28'),
            lastAlertSentAt: at('2026-08-24'),
        });
        assert.equal(onTime.nextAlertDate, delayed.nextAlertDate);
        assert.equal(onTime.due, delayed.due);
    });
});
describe('inactivity alerts ignore update level', () => {
    const enrollment = {
        id: 'e1',
        entry: 'other-group',
        student: { name: 'Dana Reyes', email: 'dana@example.com' },
        registeredBy: { name: 'Sam Okafor', email: 'sam@example.com' },
        rosterId: 'r1',
        startedAt: MON_10,
        contacts: [
            { id: 'c1', name: 'Lee Park', email: 'lee@example.com', role: 'boss', level: 1 },
            { id: 'c2', name: 'Jo Silva', email: 'jo@example.com', role: 'hr', level: 2 },
            { id: 'c3', name: 'Sam Okafor', email: 'sam@example.com', role: 'registrant', level: 3 },
        ],
    };
    test('every contact at every level receives the alert', () => {
        const { notifications, state } = inactivityNotifications({
            enrollment,
            lastActivityAt: MON_10,
            now: at('2026-08-19'),
        });
        assert.equal(state.due, true);
        assert.equal(notifications.length, 3, 'Level 1, 2 and 3 contacts all get it');
        assert.deepEqual(notifications.map((n) => n.to.level).sort(), [1, 2, 3], 'a weekly-digest contact still gets this immediately');
        for (const n of notifications) {
            assert.equal(n.kind, 'inactivity-alert');
            assert.equal(n.triggeredByLevel, undefined, 'this alert is not caused by a level');
        }
    });
    test('nothing is sent when no alert is due', () => {
        const { notifications } = inactivityNotifications({
            enrollment,
            lastActivityAt: MON_10,
            now: at('2026-08-18'),
        });
        assert.equal(notifications.length, 0);
    });
    test('repeat alerts say so', () => {
        const { notifications } = inactivityNotifications({
            enrollment,
            lastActivityAt: MON_10,
            now: at('2026-08-28'),
            lastAlertSentAt: at('2026-08-19'),
        });
        assert.equal(notifications.length, 3);
        assert.match(notifications[0].subject, /Still no activity/);
    });
});
//# sourceMappingURL=inactivity.test.js.map