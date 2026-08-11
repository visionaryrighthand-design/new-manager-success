/**
 * Cadence report.
 *
 *   npm run report:cadence -w @nms/content
 *
 * How often each Rep asks the learner to do something, and — the number that
 * actually matters — how long the worst stretch of pure reading runs.
 *
 * The product is benchmarked against Duolingo, which rarely leaves anyone more
 * than about twenty seconds without an input. This is nowhere near that and
 * does not need to be: a Curveball is a genuine decision, not a tap. But a Rep
 * that runs two and a half minutes of scrolling between interactions has
 * stopped being a lesson and become a document, however well its cards are
 * set, and that is what this catches.
 */
import { module01, repCadence, feedCards, isInteractive } from '../dist/index.js';

/** Above this, a run reads as homework. Chosen to flag, not to fail a build. */
const COMFORTABLE_SECONDS = 90;

const rows = module01.reps.map((rep) => ({ rep, ...repCadence(rep) }));

console.log('\nCADENCE — New Manager Success, Module 1');
console.log('='.repeat(78));
console.log('How long a learner goes with nothing to do.\n');
console.log('  rep   cards  inputs   longest passive run');
console.log('  ' + '─'.repeat(74));

for (const r of rows) {
  const mins = `${Math.floor(r.longestPassiveSeconds / 60)}m${String(r.longestPassiveSeconds % 60).padStart(2, '0')}`;
  const flag = r.longestPassiveSeconds > COMFORTABLE_SECONDS ? '  ← long' : '';
  console.log(
    `  ${r.rep.number}   ${String(r.cards).padStart(4)}   ${String(r.interactions).padStart(4)}    ` +
      `${String(r.longestPassiveRun).padStart(2)} cards / ${mins}${flag}`,
  );
}

const over = rows.filter((r) => r.longestPassiveSeconds > COMFORTABLE_SECONDS);
const worst = rows.reduce((a, b) => (b.longestPassiveSeconds > a.longestPassiveSeconds ? b : a));

console.log('\n' + '='.repeat(78));
console.log(
  `Worst: Rep ${worst.rep.number} — ${worst.longestPassiveRun} cards, ` +
    `${Math.floor(worst.longestPassiveSeconds / 60)}m${String(worst.longestPassiveSeconds % 60).padStart(2, '0')} ` +
    'with no input.',
);
console.log(
  over.length === 0
    ? `No Rep runs longer than ${COMFORTABLE_SECONDS}s without an input.`
    : `${over.length} of ${rows.length} Reps run longer than ${COMFORTABLE_SECONDS}s without an input: ` +
        over.map((r) => r.rep.number).join(', '),
);

console.log('\nWhere the inputs are, per Rep:\n');
for (const r of rows) {
  const shape = feedCards(r.rep)
    .map((c) => (isInteractive(c) ? (c.kind === 'gutCheck' ? '!' : '◆') : '·'))
    .join('');
  console.log(`  ${r.rep.number}  ${shape}`);
}
console.log('\n  · card to read    ! Gut Check    ◆ Curveball, Field Note or quiz\n');
