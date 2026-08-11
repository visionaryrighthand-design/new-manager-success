/**
 * Avatar production shot list.
 *
 *   npm run shotlist -w @nms/content              # whole module, to stdout
 *   npm run shotlist -w @nms/content -- m1-r1     # one Rep
 *   npm run shotlist -w @nms/content -- --csv     # CSV for a production tracker
 *
 * Emits one row per beat that needs avatar footage, with the exact narration
 * to paste into Synthesia. Beats that are NOT avatar beats are listed too, and
 * marked "no footage" — build-lists and full-screen moments are already
 * animated natively and would look worse as video.
 *
 * The clip id is the filename to render to. Once a clip exists, set
 * `videoUrl` on that beat in packages/content/src/module-01/rep-XX.ts and the
 * feed picks it up. Beats without a clip keep rendering as text, so footage
 * can land one Rep at a time without blocking anything.
 */
import {
  module01,
  findRep,
  estimateBeatSeconds,
  beatNeedsFootage,
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

function clipId(rep: Rep, beat: Beat): string {
  return `${rep.id}-${beat.id}`;
}

/** Narration exactly as it should be pasted into the avatar tool. */
function narration(beat: Beat): string {
  return (beat.speech ?? '').replace(/\n\n/g, ' ').replace(/\s+/g, ' ').trim();
}

const rows = reps.flatMap((rep) =>
  rep.beats.map((beat) => ({
    rep: rep.number,
    repId: rep.id,
    beat: beat.id,
    type: beat.type,
    clip: beatNeedsFootage(beat) ? clipId(rep, beat) : '',
    direction: beat.direction ?? '',
    seconds: estimateBeatSeconds(beat),
    words: narration(beat) ? narration(beat).split(' ').length : 0,
    onScreen: beat.text ?? (beat.items ?? []).join(' • '),
    narration: narration(beat),
    // A `hold` is a direction for a video edit — the feed already holds
    // indefinitely because the learner drives every advance, so the player
    // skips them entirely. They are listed only so the shot list maps
    // one-to-one onto the script.
    status: beat.videoUrl
      ? 'HAS FOOTAGE'
      : beatNeedsFootage(beat)
        ? 'to render'
        : beat.type === 'hold'
          ? 'not shown — edit direction only'
          : beat.type === 'reading'
            ? 'no footage — reading card, by decision'
            : 'no footage — native card',
  })),
);

if (asMarkdown) {
  const toRender = rows.filter((r) => r.status === 'to render');
  const totalSeconds = toRender.reduce((n, r) => n + r.seconds, 0);
  const totalWords = toRender.reduce((n, r) => n + r.words, 0);

  console.log('# Avatar shot list — New Manager Success, Module 1\n');
  console.log(`**${toRender.length} clips · ${duration(totalSeconds)} of footage · ${totalWords} words**\n`);
  console.log('Render **one clip per beat**, not one video per Rep. The app plays a card');
  console.log('per beat and a Curveball interrupts between them — a single long video in a');
  console.log('feed is just a video. Build-lists and full-screen moments are marked *native');
  console.log('card*: they are already animated in the app and need no footage.\n');
  console.log('Narration is flattened to one paragraph and ready to paste. Do not re-wrap it.\n');
  console.log('---\n');

  let currentRep = '';
  for (const r of rows) {
    if (r.rep !== currentRep) {
      currentRep = r.rep;
      const rep = reps.find((x) => x.number === r.rep)!;
      const clips = rows.filter((x) => x.rep === r.rep && x.status === 'to render');
      console.log(`\n## Rep ${rep.number} — ${rep.title}\n`);
      if (rep.subtitle) console.log(`*${rep.subtitle}*\n`);
      console.log(`${clips.length} clips · ${clips.reduce((n, x) => n + x.seconds, 0)}s · ${clips.reduce((n, x) => n + x.words, 0)} words\n`);
    }
    if (r.status !== 'to render' && r.status !== 'HAS FOOTAGE') {
      const label = r.onScreen ? `: ${r.onScreen}` : '';
      console.log(`- \`${r.beat}\` — *${r.status}*${label}`);
      continue;
    }
    console.log(`\n### \`${r.clip}\`  ·  ~${r.seconds}s  ·  ${r.words} words\n`);
    if (r.direction) console.log(`**Camera:** ${r.direction}  `);
    if (r.onScreen) console.log(`**On screen:** ${r.onScreen}  `);
    console.log('');
    console.log('```');
    console.log(r.narration);
    console.log('```');
  }
  console.log('\n---\n');
  console.log('## Wiring a clip in\n');
  console.log('Set `videoUrl` on that beat in `packages/content/src/module-01/rep-XX.ts`.');
  console.log('It must be a direct MP4 or HLS URL — a Google Drive share link will not play.');
  console.log('Beats without a `videoUrl` keep rendering as text, so clips can land one at a time.\n');
} else if (asCsv) {
  const cols = ['rep', 'clip', 'type', 'direction', 'seconds', 'words', 'status', 'narration'] as const;
  const esc = (v: unknown) => `"${String(v).replace(/"/g, '""')}"`;
  console.log(cols.join(','));
  for (const r of rows) console.log(cols.map((c) => esc(r[c])).join(','));
} else {
  const toRender = rows.filter((r) => r.status === 'to render');
  const totalSeconds = toRender.reduce((n, r) => n + r.seconds, 0);

  console.log('\nAVATAR SHOT LIST');
  console.log('='.repeat(78));
  console.log(
    `${toRender.length} clips to render · ${duration(totalSeconds)} of footage · ` +
      `${toRender.reduce((n, r) => n + r.words, 0)} words\n`,
  );
  console.log('Render one clip per beat. Do NOT render a Rep as a single video —');
  console.log('the format is the product, and a long video in a feed is just a video.\n');

  let currentRep = '';
  for (const r of rows) {
    if (r.rep !== currentRep) {
      currentRep = r.rep;
      const rep = reps.find((x) => x.number === r.rep)!;
      console.log(`\n${'─'.repeat(78)}`);
      console.log(`REP ${rep.number} — ${rep.title}`);
      console.log('─'.repeat(78));
    }
    if (r.status !== 'to render' && r.status !== 'HAS FOOTAGE') {
      console.log(`\n  [${r.beat}] ${r.type} — ${r.status}`);
      if (r.onScreen) console.log(`        on screen: ${r.onScreen.slice(0, 70)}`);
      continue;
    }
    console.log(`\n  ▸ ${r.clip}   (${r.seconds}s · ${r.words} words · ${r.status})`);
    if (r.direction) console.log(`    direction: ${r.direction}`);
    if (r.onScreen) console.log(`    on screen: ${r.onScreen}`);
    console.log(`    ── narration ──`);
    for (const line of wrap(r.narration, 70)) console.log(`    ${line}`);
  }
  console.log(`\n${'='.repeat(78)}`);
  console.log('When a clip is rendered, set videoUrl on that beat in');
  console.log('packages/content/src/module-01/rep-XX.ts. Use a direct MP4 or HLS URL —');
  console.log('a Google Drive share link will not play.\n');
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
