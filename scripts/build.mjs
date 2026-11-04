import { cp, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
await mkdir(`${root}dist`, { recursive: true });
for (const file of await readdir(`${root}src`)) {
  await cp(`${root}src/${file}`, `${root}dist/${file}`, { recursive: true });
}
console.log('Portfolio built to dist/');
