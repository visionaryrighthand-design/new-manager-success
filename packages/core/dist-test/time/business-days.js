/**
 * Business-day arithmetic.
 *
 * The inactivity rule is specified in *business* days ("fires when a student
 * has had no activity for 7 business days"), so this is load-bearing: get it
 * wrong and every alert lands on the wrong day, or fires over a weekend and
 * makes the product look broken to an HR buyer.
 *
 * Definitions used here:
 *  - A business day is Monday–Friday, excluding any date in `holidays`.
 *  - Comparisons happen on calendar dates in a fixed IANA time zone, not on
 *    instants. A learner in Sydney and their HR contact in Denver must agree
 *    on what "7 business days" means, so the tenant's zone decides — never
 *    the server's.
 *  - `addBusinessDays(d, n)` returns the date n business days *after* d,
 *    skipping over non-business days. `addBusinessDays(friday, 1)` is Monday.
 *
 * The spec does not say whether public holidays count. They are supported and
 * default to empty; see docs/product/MVP_SPEC.md § Open questions.
 */
const DEFAULT_BUSINESS_WEEKDAYS = [1, 2, 3, 4, 5];
const MS_PER_DAY = 86_400_000;
/** Formats an instant as a calendar date in the given zone. */
export function toCalendarDate(instant, timeZone = 'UTC') {
    // 'en-CA' formats as YYYY-MM-DD, which sorts and parses cleanly.
    return new Intl.DateTimeFormat('en-CA', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(instant);
}
/** Parses 'YYYY-MM-DD' to the UTC midnight instant of that calendar date. */
export function fromCalendarDate(date) {
    const parsed = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!parsed)
        throw new RangeError(`Not a calendar date: ${date}`);
    const [, y, m, d] = parsed;
    return new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
}
/** Day of week for a calendar date, 0=Sunday..6=Saturday. */
export function dayOfWeek(date) {
    return fromCalendarDate(date).getUTCDay();
}
export function isBusinessDay(date, options = {}) {
    const weekdays = options.businessWeekdays ?? DEFAULT_BUSINESS_WEEKDAYS;
    if (!weekdays.includes(dayOfWeek(date)))
        return false;
    return !(options.holidays ?? []).includes(date);
}
/** Shifts a calendar date by whole calendar days. */
export function addCalendarDays(date, days) {
    const shifted = new Date(fromCalendarDate(date).getTime() + days * MS_PER_DAY);
    return shifted.toISOString().slice(0, 10);
}
/**
 * Returns the calendar date `count` business days after `from`.
 * `count` must be >= 0. Non-business start dates are handled naturally:
 * counting forward from a Saturday reaches Monday at count 1.
 */
export function addBusinessDays(from, count, options = {}) {
    if (!Number.isInteger(count) || count < 0) {
        throw new RangeError(`count must be a non-negative integer, got ${count}`);
    }
    let cursor = from;
    let remaining = count;
    // Bounded to keep a bad holiday list from spinning forever: 7 business days
    // can never need more than a few hundred calendar days of headroom.
    let guard = 0;
    while (remaining > 0) {
        if (guard++ > 3650) {
            throw new RangeError('addBusinessDays: no business days found within 10 years');
        }
        cursor = addCalendarDays(cursor, 1);
        if (isBusinessDay(cursor, options))
            remaining -= 1;
    }
    return cursor;
}
/**
 * Number of business days strictly after `from` up to and including `to`.
 * Same day is 0. Friday to the following Monday is 1.
 */
export function businessDaysBetween(from, to, options = {}) {
    if (to <= from)
        return 0;
    let count = 0;
    let cursor = from;
    while (cursor < to) {
        cursor = addCalendarDays(cursor, 1);
        if (isBusinessDay(cursor, options))
            count += 1;
    }
    return count;
}
//# sourceMappingURL=business-days.js.map