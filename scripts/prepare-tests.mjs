import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';
import { jqueryVersions } from '../tests/jquery-versions.mjs';

// Historical releases run only in isolated test windows. They never enter the
// dependency graph or the published package.
const fixtures = jqueryVersions.map(({ version, sha256 }) => ({
  path: `.cache/jquery/${version}.js`,
  url: `https://code.jquery.com/jquery-${version === '1.7.0' ? '1.7' : version}.js`,
  sha256,
}));
fixtures.push(
  {
    path: '.cache/bootstrap/bootstrap.min.css',
    url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/css/bootstrap.min.css',
    sha256: '9caac977a0af0c2229abd397eee3345899c4020da2a1a0b711c1cc543fe3719d',
  },
  {
    path: '.cache/bootstrap/bootstrap.bundle.min.js',
    url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.9/dist/js/bootstrap.bundle.min.js',
    sha256: '4ad2ad30a7df1fa0a615c4cfeb1aeffbe92019a8dff0262c99464acbd56dca5c',
  },
);
for (const { path, url, sha256 } of fixtures) {
  await mkdir(dirname(path), { recursive: true });
  let source;
  let downloaded = false;
  try {
    source = await readFile(path, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    source = await response.text();
    downloaded = true;
  }
  if (createHash('sha256').update(source).digest('hex') !== sha256) {
    throw new Error(`Unexpected fixture ${path}: SHA-256 mismatch`);
  }
  if (downloaded) {
    await writeFile(path, source);
    console.log(`Cached ${path}`);
  }
}
