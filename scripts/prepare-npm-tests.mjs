import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { npmVersions } from '../tests/npm-versions.mjs';

await mkdir('.cache/npm', { recursive: true });
for (const { version, url, integrity } of npmVersions) {
  const archive = `.cache/npm/jquery-${version}.tgz`;
  let bytes;
  try {
    bytes = await readFile(archive);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    bytes = Buffer.from(await response.arrayBuffer());
  }
  if (`sha512-${createHash('sha512').update(bytes).digest('base64')}` !== integrity) {
    throw new Error(`Unexpected npm fixture ${version}: SHA-512 mismatch`);
  }
  await writeFile(archive, bytes);
  const destination = `.cache/npm/${version}/node_modules/jquery`;
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  execFileSync('tar', ['-xzf', archive, '-C', destination, '--strip-components=1']);
  const plugin = `.cache/npm/${version}/node_modules/jgrowl`;
  await mkdir(plugin, { recursive: true });
  await copyFile('package.json', `${plugin}/package.json`);
  await copyFile('jquery.jgrowl.js', `${plugin}/jquery.jgrowl.js`);
}
