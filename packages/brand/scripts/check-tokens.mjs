/**
 * Fails the build if any `var(--nms-*)` in the codebase references a token that
 * `tokens.css` does not define.
 *
 * This exists because of a real bug: renaming the `volt`/`ember` tokens during
 * the rebrand left `var(--nms-color-ember)` behind in the player stylesheet.
 * CSS custom properties fail *silently* — the Curveball labels simply inherited
 * their colour and nothing anywhere reported a problem. A typo in a token name
 * has exactly the same signature.
 *
 * Run: node packages/brand/scripts/check-tokens.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../../..');
const tokensPath = resolve(here, '../assets/tokens.css');

const defined = new Set(
  [...readFileSync(tokensPath, 'utf8').matchAll(/(--nms-[a-z0-9-]+)\s*:/g)].map((m) => m[1]),
);

const SKIP_DIRS = new Set(['node_modules', '.next', 'dist', 'dist-test', '.git', '.expo']);
const EXTENSIONS = ['.css', '.tsx', '.ts', '.jsx', '.js'];

/** @type {string[]} */
const problems = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!EXTENSIONS.some((ext) => entry.endsWith(ext))) continue;
    // The generator and the token file itself define rather than consume.
    if (full === tokensPath || entry === 'gen-tokens.mjs') continue;

    const source = readFileSync(full, 'utf8');
    source.split('\n').forEach((line, i) => {
      for (const match of line.matchAll(/var\(\s*(--nms-[a-z0-9-]+)/g)) {
        const token = match[1];
        if (!defined.has(token)) {
          problems.push(`${relative(repoRoot, full)}:${i + 1}  ${token}`);
        }
      }
    });
  }
}

walk(repoRoot);

if (problems.length > 0) {
  console.error(`\nUndefined design tokens (${problems.length}):\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error(`\n${defined.size} tokens are defined in packages/brand/assets/tokens.css.`);
  console.error('Fix the reference, or add the token to packages/brand/src/ and rebuild.\n');
  process.exit(1);
}

console.log(`Design tokens: OK — every var(--nms-*) resolves (${defined.size} defined).`);
