import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'dist');
if (dirname(output) !== resolve(root) || basename(output) !== 'dist') {
  throw new Error('Build output must be the project dist directory.');
}
await rm(output, { recursive: true, force: true });
await mkdir(`${root}dist`, { recursive: true });
for (const file of await readdir(`${root}src`)) {
  await cp(`${root}src/${file}`, `${root}dist/${file}`, { recursive: true });
}
console.log('Portfolio built to dist/');
