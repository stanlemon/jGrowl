import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { jqueryVersions } from '../tests/jquery-versions.mjs';

// Historical releases run only in isolated test windows. They never enter the
// dependency graph or the published package.
await mkdir('.cache/jquery', { recursive: true });
for (const { version, sha256 } of jqueryVersions) {
  const path = `.cache/jquery/${version}.js`;
  let source;
  let downloaded = false;
  try {
    source = await readFile(path, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const release = version === '1.7.0' ? '1.7' : version;
    const url = `https://code.jquery.com/jquery-${release}.js`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    source = await response.text();
    downloaded = true;
  }
  if (createHash('sha256').update(source).digest('hex') !== sha256) {
    throw new Error(`Unexpected jQuery source for ${version}: SHA-256 mismatch`);
  }
  if (downloaded) {
    await writeFile(path, source);
    console.log(`Cached jQuery ${version}`);
  }
}
