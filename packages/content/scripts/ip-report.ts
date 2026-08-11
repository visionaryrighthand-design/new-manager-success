/**
 * Prints every recorded difference between the approved course scripts and
 * what ships, grouped by severity. Run before any content sign-off:
 *
 *   npm run report:ip -w @promoted/content
 *
 * "Locked" only means something if changes are visible. This is that.
 */
import { scriptDeviations } from '../dist/index.js';

const deviations = scriptDeviations();

if (deviations.length === 0) {
  console.log('No script deviations recorded. Everything ships verbatim.');
  process.exit(0);
}

const bySeverity = new Map<string, typeof deviations>();
for (const d of deviations) {
  const list = bySeverity.get(d.severity) ?? [];
  list.push(d);
  bySeverity.set(d.severity, list);
}

console.log('\nSCRIPT DEVIATION REPORT');
console.log('='.repeat(72));
console.log(`${deviations.length} recorded change(s) from the approved scripts.\n`);

for (const severity of ['legal', 'editorial', 'production']) {
  const list = bySeverity.get(severity);
  if (!list?.length) continue;

  console.log(`\n${severity.toUpperCase()} (${list.length})`);
  console.log('-'.repeat(72));

  for (const d of list) {
    console.log(`\n[${d.ref}]  Rep ${d.repNumber}`);
    console.log(`  APPROVED : ${d.original}`);
    console.log(`  SHIPPING : ${d.shipped}`);
    console.log(`  WHY      : ${d.reason}`);
    console.log(`  SIGN-OFF : ${d.needsSignoffFrom}`);
  }
}

console.log(`\n${'='.repeat(72)}`);
console.log('None of the above may ship without the named sign-off.\n');
