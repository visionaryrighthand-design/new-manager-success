/**
 * Content health check. Validates the rules the product depends on, then
 * prints per-Rep timing against the script's own targets.
 *
 *   npm run report:content -w @nms/content
 *
 * Two timings are reported and they answer different questions:
 *
 *   NARR  — narration and on-screen beats only. What a straight video edit
 *           would run, and the number to compare against the script header's
 *           "Target Duration: 7 minutes".
 *   TOTAL — what the Rep actually costs a learner in the app, including
 *           video and the quiz. This is the number the
 *           "7-minute lesson" promise should be held to.
 *
 * Exits non-zero on validation problems so this can gate CI.
 */
import {
  course,
  validateContent,
  estimateRepSeconds,
  estimateRepTotalSeconds,
} from '../dist/index.js';

const problems = validateContent();

console.log('\nCONTENT REPORT');
console.log('='.repeat(78));

for (const mod of course.modules) {
  console.log(`\nModule ${mod.number}: ${mod.title} — ${mod.subtitle}  [${mod.status}]`);
  console.log('-'.repeat(78));
  console.log('Rep    Title                                  Target   NARR   TOTAL  Beats  Q  CB');

  let totalTarget = 0;
  let totalNarration = 0;
  let totalInApp = 0;

  for (const rep of mod.reps) {
    const narration = estimateRepSeconds(rep);
    const inApp = estimateRepTotalSeconds(rep);
    totalTarget += rep.durationMinutes * 60;
    totalNarration += narration;
    totalInApp += inApp;

    console.log(
      [
        rep.number.padEnd(6),
        rep.title.slice(0, 38).padEnd(38),
        `${rep.durationMinutes}m`.padStart(6),
        fmt(narration).padStart(6),
        fmt(inApp).padStart(7),
        String(rep.beats.length).padStart(6),
        String(rep.quiz.length).padStart(3),
        rep.videoUrl ? ' ✓ ' : '  ·',
      ].join(' '),
    );
  }

  console.log('-'.repeat(78));
  console.log(
    `Totals   target ${fmt(totalTarget)}    narration ${fmt(totalNarration)}    in-app ${fmt(totalInApp)}`,
  );
  console.log(
    `         Reps ${mod.reps.length} · questions ${mod.reps.reduce((n, r) => n + r.quiz.length, 0)}` +
      ` · films ${mod.reps.filter((r) => r.videoUrl).length}/${mod.reps.length}`,
  );

  const shortfall = totalTarget - totalNarration;
  if (shortfall > 300) {
    console.log(
      `\n  NOTE: narration runs ${fmt(shortfall)} under the script headers' combined target.\n` +
        `  The approved scripts contain ~4,500 words against the ~6,200 their own\n` +
        `  headers claim, so this is a property of the source, not of this transcription.\n` +
        `  In-app time lands at ${fmt(Math.round(totalInApp / mod.reps.length))} per Rep once interactions\n` +
        `  are counted. Decision needed: accept the shorter Rep, or commission more script.\n` +
        `  See docs/product/MVP_SPEC.md § Runtime.`,
    );
  }
}

console.log(`\n${'='.repeat(78)}`);
if (problems.length === 0) {
  console.log('Validation: PASS — no problems found.\n');
} else {
  console.log(`Validation: FAIL — ${problems.length} problem(s):\n`);
  for (const p of problems) console.log(`  - ${p}`);
  console.log('');
  process.exit(1);
}

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m${String(s).padStart(2, '0')}`;
}
