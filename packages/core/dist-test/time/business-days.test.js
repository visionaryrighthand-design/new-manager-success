import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { addBusinessDays, businessDaysBetween, isBusinessDay, toCalendarDate, } from './business-days.js';
// Reference week used throughout: 2026-08-10 is a Monday.
//   Mon 2026-08-10, Tue 11, Wed 12, Thu 13, Fri 14, Sat 15, Sun 16, Mon 17
describe('isBusinessDay', () => {
    test('Monday to Friday are business days', () => {
        for (const d of ['2026-08-10', '2026-08-11', '2026-08-12', '2026-08-13', '2026-08-14']) {
            assert.equal(isBusinessDay(d), true, `${d} should be a business day`);
        }
    });
    test('Saturday and Sunday are not', () => {
        assert.equal(isBusinessDay('2026-08-15'), false);
        assert.equal(isBusinessDay('2026-08-16'), false);
    });
    test('holidays are excluded', () => {
        assert.equal(isBusinessDay('2026-08-12', { holidays: ['2026-08-12'] }), false);
    });
    test('a non-Mon-Fri business week is supported', () => {
        // A restaurant open Tue-Sat. Explicitly in the target market.
        const opts = { businessWeekdays: [2, 3, 4, 5, 6] };
        assert.equal(isBusinessDay('2026-08-10', opts), false, 'Monday closed');
        assert.equal(isBusinessDay('2026-08-15', opts), true, 'Saturday open');
    });
});
describe('addBusinessDays', () => {
    test('one business day after Friday is Monday', () => {
        assert.equal(addBusinessDays('2026-08-14', 1), '2026-08-17');
    });
    test('zero returns the same date, even on a weekend', () => {
        assert.equal(addBusinessDays('2026-08-15', 0), '2026-08-15');
    });
    test('counting forward from a Saturday reaches Monday at 1', () => {
        assert.equal(addBusinessDays('2026-08-15', 1), '2026-08-17');
    });
    test('7 business days from Monday is the following Wednesday', () => {
        // Tue 11, Wed 12, Thu 13, Fri 14, Mon 17, Tue 18, Wed 19
        assert.equal(addBusinessDays('2026-08-10', 7), '2026-08-19');
    });
    test('holidays push the result out', () => {
        assert.equal(addBusinessDays('2026-08-10', 7, { holidays: ['2026-08-12'] }), '2026-08-20');
    });
    test('rejects negative counts', () => {
        assert.throws(() => addBusinessDays('2026-08-10', -1), RangeError);
    });
});
describe('businessDaysBetween', () => {
    test('same day is zero', () => {
        assert.equal(businessDaysBetween('2026-08-10', '2026-08-10'), 0);
    });
    test('Friday to Monday is one', () => {
        assert.equal(businessDaysBetween('2026-08-14', '2026-08-17'), 1);
    });
    test('a full weekend adds nothing', () => {
        assert.equal(businessDaysBetween('2026-08-14', '2026-08-16'), 0);
    });
    test('Monday to the following Wednesday is seven', () => {
        assert.equal(businessDaysBetween('2026-08-10', '2026-08-19'), 7);
    });
    test('is not symmetric — a backwards range is zero, not negative', () => {
        assert.equal(businessDaysBetween('2026-08-19', '2026-08-10'), 0);
    });
});
describe('toCalendarDate', () => {
    test('resolves the date in the tenant zone, not the server zone', () => {
        // 2026-08-12T02:00Z is still 11 August in Denver and already 12 August in Sydney.
        const instant = new Date('2026-08-12T02:00:00Z');
        assert.equal(toCalendarDate(instant, 'America/Denver'), '2026-08-11');
        assert.equal(toCalendarDate(instant, 'Australia/Sydney'), '2026-08-12');
        assert.equal(toCalendarDate(instant, 'UTC'), '2026-08-12');
    });
});
//# sourceMappingURL=business-days.test.js.map