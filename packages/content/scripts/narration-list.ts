/**
 * Voiceover recording list.
 *
 *   npm run narration -w @nms/content              # whole module, to stdout
 *   npm run narration -w @nms/content -- m1-r1     # one Rep
 *   npm run narration -w @nms/content -- --csv     # CSV for a production tracker
 *   npm run narration -w @nms/content -- --md      # markdown, to hand to a VO artist
 *
 * Emits one row per beat that needs a voiceover, with the exact line to read.
 * Beats that need no recording are listed too, and marked — build-lists,
 * full-screen moments and reading cards are read in silence by design.
 *
 * The take id is the filename to record to. Once a file exists, set `audioUrl`
 * on that beat in packages/content/src/module-01/rep-XX.ts and the feed picks
 * it up. Beats without audio stay fully usable — the card is the product and
 * audio rides on top of it — so recordings can land one Rep at a time.
 */
import {
  module01,
  findRep,
  estimateBeatSeconds,
  beatNeedsVoiceover,
  type Rep,
  type Beat,
} from '../dist/index.js';

const args = process.argv.slice(2);
const asCsv = args.includes('--csv');
const asMarkdown = args.includes('--md');
const repArg = args.find((a) => !a.startsWith('--'));

const reps: Rep[] = repArg
  ? [findRep(repArg) ?? fail(`Unknown Rep: ${repArg}`)]
  : module01.reps;

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

/** "~2 min" reads fine; "~0 min" for the last 25 seconds of a Rep does not. */
function duration(totalSeconds: number): string {
  return totalSeconds < 90 ? `${totalSeconds}s` : `~${Math.round(totalSeconds / 60)} min`;
}

function takeId(rep: Rep, beat: Beat): string {
  return `${rep.id}-${beat.id}`;
}

/** The line exactly as it should be read. */
function narration(beat: Beat): string {
  return (beat.speech ?? '').replace(/\n\n/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Why a beat is not on the recording list. Each of these is a decision rather
 * than an omission, so the list says which one.
 */
function silentReason(beat: Beat): string {
  if (beat.type === 'hold') return 'not shown — edit direction only';
  if (beat.type === 'reading') return 'no audio — reading card, by decision';
  return 'no audio — read in silence';
}

const rows = reps.flatMap((rep) =>
  rep.beats.map((beat) => ({
    rep: rep.number,
    repId: rep.id,
    beat: beat.id,
    type: beat.type,
    take: beatNeedsVoiceover(beat) ? takeId(rep, beat) : '',
    direction: beat.direction ?? '',
    seconds: estimateBeatSeconds(beat),
    words: narration(beat) ? narration(beat).split(' ').length : 0,
    onScreen: beat.text ?? (beat.items ?? []).join(' • '),
    narration: narration(beat),
    status: beat.audioUrl
      ? 'RECORDED'
      : beatNeedsVoiceover(beat)
        ? 'to record'
        : silentReason(beat),
  })),
);

if (asMarkdown) {
  const toRecord = rows.filter((r) => r.status === 'to record');
  const totalSeconds = toRecord.reduce((n, r) => n + r.seconds, 0);
  const totalWords = toRecord.reduce((n, r) => n + r.words, 0);

  console.log('# Voiceover list — New Manager Success, Module 1\n');
  console.log(`**${toRecord.length} takes · ${duration(totalSeconds)} of audio · ${totalWords} words**\n`);
  console.log('Record **one take per beat**, not one track per Rep. The app plays a card');
  console.log('per beat and a Curveball interrupts between them, so a single long track');
  console.log('cannot line up with the feed — and re-recording one line is cheap where');
  console.log('re-cutting a long track is not.\n');
  console.log('Every card reads on its own without sound. Audio deepens a card; it does');
  console.log('not carry one. Beats marked *no audio* are read in silence by design.\n');
  console.log('Lines are flattened to one paragraph and ready to read. Do not re-wrap them.\n');
  console.log('---\n');

  let currentRep = '';
  for (const r of rows) {
    if (r.rep !== currentRep) {
      currentRep = r.rep;
      const rep = reps.find((x) => x.number === r.rep)!;
      const takes = rows.filter((x) => x.rep === r.rep && x.status === 'to record');
      console.log(`\n## Rep ${rep.number} — ${rep.title}\n`);
      if (rep.subtitle) console.log(`*${rep.subtitle}*\n`);
      console.log(`${takes.length} takes · ${takes.reduce((n, x) => n + x.seconds, 0)}s · ${takes.reduce((n, x) => n + x.words, 0)} words\n`);
    }
    if (r.status !== 'to record' && r.status !== 'RECORDED') {
      const label = r.onScreen ? `: ${r.onScreen}` : '';
      console.log(`- \`${r.beat}\` — *${r.status}*${label}`);
      continue;
    }
    console.log(`\n### \`${r.take}\`  ·  ~${r.seconds}s  ·  ${r.words} words\n`);
    if (r.direction) console.log(`**Delivery:** ${r.direction}  `);
    if (r.onScreen) console.log(`**On screen:** ${r.onScreen}  `);
    console.log('');
    console.log('```');
    console.log(r.narration);
    console.log('```');
  }
  console.log('\n---\n');
  console.log('## Wiring a take in\n');
  console.log('Set `audioUrl` on that beat in `packages/content/src/module-01/rep-XX.ts`.');
  console.log('It must be a direct .mp3, .m4a, .aac, .wav or .ogg URL — a share page will');
  console.log('not play. Beats without audio stay fully usable, so takes can land one at');
  console.log('a time and nothing is ever half-broken.\n');
} else if (asCsv) {
  const cols = ['rep', 'take', 'type', 'direction', 'seconds', 'words', 'status', 'narration'] as const;
  const esc = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`;
  console.log(cols.join(','));
  for (const r of rows) console.log(cols.map((c) => esc(r[c])).join(','));
} else {
  const toRecord = rows.filter((r) => r.status === 'to record');
  const totalSeconds = toRecord.reduce((n, r) => n + r.seconds, 0);

  console.log('\nVOICEOVER LIST');
  console.log('='.repeat(78));
  console.log(
    `${toRecord.length} takes to record · ${duration(totalSeconds)} of audio · ` +
      `${toRecord.reduce((n, r) => n + r.words, 0)} words\n`,
  );
  console.log('Record one take per beat. Do NOT record a Rep as a single track —');
  console.log('a Curveball interrupts between beats, and one long track cannot.\n');

  let currentRep = '';
  for (const r of rows) {
    if (r.rep !== currentRep) {
      currentRep = r.rep;
      const rep = reps.find((x) => x.number === r.rep)!;
      console.log(`\n${'─'.repeat(78)}`);
      console.log(`REP ${rep.number} — ${rep.title}`);
      console.log('─'.repeat(78));
    }
    if (r.status !== 'to record' && r.status !== 'RECORDED') {
      console.log(`\n  [${r.beat}] ${r.type} — ${r.status}`);
      if (r.onScreen) console.log(`        on screen: ${r.onScreen.slice(0, 70)}`);
      continue;
    }
    console.log(`\n  ▸ ${r.take}   (${r.seconds}s · ${r.words} words · ${r.status})`);
    if (r.direction) console.log(`    delivery: ${r.direction}`);
    if (r.onScreen) console.log(`    on screen: ${r.onScreen}`);
    console.log(`    ── line ──`);
    for (const line of wrap(r.narration, 70)) console.log(`    ${line}`);
  }
  console.log(`\n${'='.repeat(78)}`);
  console.log('When a take is recorded, set audioUrl on that beat in');
  console.log('packages/content/src/module-01/rep-XX.ts. Use a direct audio file URL —');
  console.log('a share page will not play.\n');
}

function wrap(text: string, width: number): string[] {
  const out: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    if ((line + ' ' + word).trim().length > width) {
      out.push(line.trim());
      line = word;
    } else line += ` ${word}`;
  }
  if (line.trim()) out.push(line.trim());
  return out;
}
