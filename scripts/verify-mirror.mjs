// The mirrored portfolio renderer.
//
// Five source files and one stylesheet exist identically in BOTH repositories:
//
//   andrewr92896-ship-it/andrewramey.com     — renders them for the public
//   andrewr92896-ship-it/andrewramey-admin   — renders them privately, and the
//                                              editor will edit through them
//
// THERE IS ONE RENDERER, NEVER TWO. Two deployments cannot import from each
// other — that boundary is the whole design — so the copy is deliberate, and
// this is what stops it becoming a fork.
//
// HOW IT CATCHES DRIFT. portfolio-mirror.json holds a SHA-256 per file and is
// itself identical in both repos. Edit a mirrored file and this fails here,
// because the hash no longer matches. Update the manifest and it passes here —
// and now fails in the OTHER repository, whose copy is still the old one, until
// the change is brought across. Neither half can be forgotten silently.
//
// Adding a file to the mirror means adding it to FILES in both repos and
// re-running with --write.
//
//   npm run verify:mirror
//   npm run verify:mirror -- --write     (after a deliberate change)

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

/** Same paths in both repositories, which is why there is no path map. */
const FILES = [
  'src/content/types.ts',
  'src/content/model.ts',
  'src/render/fields.tsx',
  'src/render/sections.tsx',
  'src/render/Portfolio.tsx',
  'src/styles.css',
];

const MANIFEST = resolve(ROOT, 'portfolio-mirror.json');
const sha = (buf) => createHash('sha256').update(buf).digest('hex');

const actual = {};
const missing = [];
for (const rel of FILES) {
  try {
    actual[rel] = sha(readFileSync(resolve(ROOT, rel)));
  } catch {
    missing.push(rel);
  }
}

if (process.argv.includes('--write')) {
  if (missing.length) {
    console.error(`✗ cannot write the manifest — missing: ${missing.join(', ')}`);
    process.exit(1);
  }
  writeFileSync(MANIFEST, `${JSON.stringify(actual, null, 2)}\n`);
  console.log('✓ portfolio-mirror.json updated.');
  console.log('  Copy the SAME files and the SAME manifest into the other repository.');
  process.exit(0);
}

let expected;
try {
  expected = JSON.parse(readFileSync(MANIFEST, 'utf8'));
} catch {
  console.error('✗ portfolio-mirror.json is missing or unreadable. Run with --write.');
  process.exit(1);
}

const problems = [];
for (const rel of missing) problems.push(`${rel} — missing from this repository`);
for (const rel of FILES) {
  if (missing.includes(rel)) continue;
  if (!expected[rel]) problems.push(`${rel} — not in the manifest`);
  else if (expected[rel] !== actual[rel]) problems.push(`${rel} — differs from the manifest`);
}
for (const rel of Object.keys(expected)) {
  if (!FILES.includes(rel)) problems.push(`${rel} — in the manifest but no longer mirrored`);
}

if (problems.length) {
  console.error('\n✗ The portfolio renderer has drifted.\n');
  for (const p of problems) console.error(`    ${p}`);
  console.error(
    '\n  These files must be byte-identical in andrewramey.com and andrewramey-admin.\n' +
      '  If the change is deliberate: copy the file into the other repository,\n' +
      '  run `npm run verify:mirror -- --write` here, and copy the manifest across\n' +
      '  too. The other repo will fail until you do, which is the point.\n',
  );
  process.exit(1);
}

console.log(`✓ portfolio renderer mirror intact (${FILES.length} files)`);
