import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { sectionCompleteNotifications, weeklyDigestNotifications } from './dispatch.js';
import { extractSubjectPhrases, MAX_ECHOED_WORDS, templateGenerator } from './coaching-questions.js';
import { emptyProgress, recordQuizAttempt, applyActivity } from '../progress/engine.js';
const WEEK_START = new Date('2026-08-10T00:00:00Z');
const WEEK_END = new Date('2026-08-17T00:00:00Z');
const enrollment = {
    id: 'e1',
    entry: 'other-individual',
    student: { name: 'Dana Reyes', email: 'dana@example.com' },
    registeredBy: { name: 'Sam Okafor', email: 'sam@example.com' },
    startedAt: new Date('2026-08-03T09:00:00Z'),
    contacts: [
        { id: 'c1', name: 'Lee Park', email: 'lee@example.com', role: 'boss', level: 1 },
        { id: 'c2', name: 'Jo Silva', email: 'jo@example.com', role: 'hr', level: 2 },
        { id: 'c3', name: 'Sam Okafor', email: 'sam@example.com', role: 'registrant', level: 3 },
    ],
};
describe('Level 1 — real-time per section', () => {
    test('only Level 1 contacts get the per-section notification', () => {
        const notes = sectionCompleteNotifications(enrollment, 'm1-r1');
        assert.equal(notes.length, 1);
        assert.equal(notes[0].to.id, 'c1');
        assert.equal(notes[0].triggeredByLevel, 1);
    });
    test('Level 2 and 3 are not double-sent — that content is in their digest', () => {
        const notes = sectionCompleteNotifications(enrollment, 'm1-r1');
        assert.equal(notes.some((n) => n.to.level > 1), false);
    });
    test('the notification names the section and its key idea', () => {
        const [note] = sectionCompleteNotifications(enrollment, 'm1-r3');
        assert.match(note.subject, /1\.3/);
        assert.match(note.subject, /Relationship Reset/);
        assert.equal(note.body.some((b) => b.type === 'stat' && b.label === 'Key idea'), true);
    });
    test('an unknown rep produces nothing rather than throwing', () => {
        assert.deepEqual(sectionCompleteNotifications(enrollment, 'nope'), []);
    });
});
describe('Level 2 and 3 — weekly digest', () => {
    function progressWithAWeek() {
        let p = emptyProgress('e1', enrollment.startedAt);
        for (const repId of ['m1-r1', 'm1-r2']) {
            p = applyActivity(p, {
                id: `a-${repId}`,
                enrollmentId: 'e1',
                type: 'rep-completed',
                repId,
                at: new Date('2026-08-12T10:00:00Z'),
            });
        }
        p = recordQuizAttempt(p, 'm1-r1', [
            { questionId: 'm1-r1-q1', optionId: 'b' },
            { questionId: 'm1-r1-q2', optionId: 'a' },
            { questionId: 'm1-r1-q3', optionId: 'b' },
        ], new Date('2026-08-12T10:05:00Z')).progress;
        return p;
    }
    test('Level 2 and Level 3 both receive a digest; Level 1 does not', () => {
        const notes = weeklyDigestNotifications({
            enrollment,
            progress: progressWithAWeek(),
            weekStart: WEEK_START,
            weekEnd: WEEK_END,
            fieldNoteAnswers: [],
        });
        assert.deepEqual(notes.map((n) => n.to.id).sort(), ['c2', 'c3']);
    });
    test('the digest carries sections completed, scores, and days since starting', () => {
        const notes = weeklyDigestNotifications({
            enrollment,
            progress: progressWithAWeek(),
            weekStart: WEEK_START,
            weekEnd: WEEK_END,
            fieldNoteAnswers: [],
        });
        const level2 = notes.find((n) => n.to.level === 2);
        const titles = level2.body.flatMap((b) => (b.type === 'list' ? [b.title] : []));
        assert.equal(titles.some((t) => t.startsWith('Completed this week')), true);
        assert.equal(titles.includes('Quiz scores'), true);
        assert.equal(level2.body.some((b) => b.type === 'stat' && b.label === 'Days since starting'), true);
    });
    test('a perfect quiz is reported as 100% and passed', () => {
        const notes = weeklyDigestNotifications({
            enrollment,
            progress: progressWithAWeek(),
            weekStart: WEEK_START,
            weekEnd: WEEK_END,
            fieldNoteAnswers: [],
        });
        const scores = notes[0].body.find((b) => b.type === 'list' && b.title === 'Quiz scores');
        assert.ok(scores && scores.type === 'list');
        assert.match(scores.items[0], /100% \(3\/3, passed\)/);
    });
    test('Level 3 gets conversation prompts, Level 2 does not', () => {
        const notes = weeklyDigestNotifications({
            enrollment,
            progress: progressWithAWeek(),
            weekStart: WEEK_START,
            weekEnd: WEEK_END,
            fieldNoteAnswers: [
                {
                    repId: 'm1-r2',
                    fieldNoteId: 'm1-r2-fn1',
                    topic: 'The doer trap',
                    text: 'I am still writing the weekly client report myself even though Priya could do it.',
                    savedAt: new Date('2026-08-12T11:00:00Z'),
                },
            ],
        });
        const level2 = notes.find((n) => n.to.level === 2);
        const level3 = notes.find((n) => n.to.level === 3);
        assert.equal(level2.body.some((b) => b.type === 'questions'), false);
        assert.equal(level3.body.some((b) => b.type === 'questions'), true);
    });
    test('a quiet week is reported honestly rather than dressed up', () => {
        const notes = weeklyDigestNotifications({
            enrollment,
            progress: emptyProgress('e1', enrollment.startedAt),
            weekStart: WEEK_START,
            weekEnd: WEEK_END,
            fieldNoteAnswers: [],
        });
        assert.match(notes[0].subject, /0 sections completed/);
        assert.equal(notes[0].body.some((b) => b.type === 'paragraph' && /did not complete any sections/.test(b.text)), true);
    });
    test('work from a previous week is not counted again', () => {
        const p = applyActivity(emptyProgress('e1', enrollment.startedAt), {
            id: 'a1',
            enrollmentId: 'e1',
            type: 'rep-completed',
            repId: 'm1-r1',
            at: new Date('2026-08-05T10:00:00Z'), // before WEEK_START
        });
        const notes = weeklyDigestNotifications({
            enrollment,
            progress: p,
            weekStart: WEEK_START,
            weekEnd: WEEK_END,
            fieldNoteAnswers: [],
        });
        assert.match(notes[0].subject, /0 sections completed/);
    });
    test('an enrollment with no Level 2+ contacts produces no digest at all', () => {
        const selfDirected = { ...enrollment, contacts: [] };
        assert.deepEqual(weeklyDigestNotifications({
            enrollment: selfDirected,
            progress: progressWithAWeek(),
            weekStart: WEEK_START,
            weekEnd: WEEK_END,
            fieldNoteAnswers: [],
        }), []);
    });
});
describe('Level 3 conversation prompts — privacy invariant', () => {
    /**
     * The contract: a contact receives questions, never the learner's answer.
     * These are the tests that make that claim enforceable.
     */
    const sensitive = 'Honestly I have completely lost confidence in my own manager and I am already interviewing somewhere else because of how the reorg was handled.';
    test('no long verbatim span from the answer reaches the output', () => {
        const questions = templateGenerator.generate({
            answers: [
                {
                    repId: 'm1-r3',
                    fieldNoteId: 'm1-r3-fn1',
                    topic: 'Relationship reset',
                    text: sensitive,
                    savedAt: new Date('2026-08-12T11:00:00Z'),
                },
            ],
            completedRepIds: ['m1-r3'],
        });
        assert.ok(questions.length > 0);
        const output = questions.map((q) => `${q.question} ${q.rationale}`).join(' ').toLowerCase();
        const words = sensitive.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').split(/\s+/);
        for (let i = 0; i + MAX_ECHOED_WORDS <= words.length; i++) {
            const span = words.slice(i, i + MAX_ECHOED_WORDS + 1).join(' ');
            assert.equal(output.includes(span), false, `output leaked a ${MAX_ECHOED_WORDS + 1}-word span from the learner's answer: "${span}"`);
        }
    });
    test('extractSubjectPhrases never returns more than MAX_ECHOED_WORDS words', () => {
        for (const phrase of extractSubjectPhrases(sensitive, 10)) {
            assert.ok(phrase.split(/\s+/).length <= MAX_ECHOED_WORDS, `phrase too long: "${phrase}"`);
        }
    });
    test('questions are still generated when no Field Note was written', () => {
        const questions = templateGenerator.generate({
            answers: [],
            completedRepIds: ['m1-r6'],
        });
        assert.ok(questions.length > 0, 'section topic alone is enough — source (b) in the spec');
        assert.equal(questions.every((q) => q.basis === 'topic'), true);
    });
    test('empty input produces nothing rather than a filler question', () => {
        assert.deepEqual(templateGenerator.generate({ answers: [], completedRepIds: [] }), []);
    });
    test('output is capped and de-duplicated', () => {
        const questions = templateGenerator.generate({
            answers: [],
            completedRepIds: ['m1-r1', 'm1-r2', 'm1-r3', 'm1-r4', 'm1-r5'],
            max: 3,
        });
        assert.equal(questions.length, 3);
        assert.equal(new Set(questions.map((q) => q.question)).size, 3);
    });
});
//# sourceMappingURL=dispatch.test.js.map