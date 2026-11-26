import { readFile, writeFile } from 'node:fs/promises';
import less from 'less';
import { minify } from 'terser';
import CleanCSS from 'clean-css';

const source = await readFile('jquery.jgrowl.js', 'utf8');
const javascript = await minify({ 'jquery.jgrowl.js': source }, {
  ecma: 5,
  format: { comments: /^!/ },
  sourceMap: { filename: 'jquery.jgrowl.min.js', url: 'jquery.jgrowl.map', includeSources: true },
});
const stylesheet = await less.render(await readFile('less/jgrowl.less', 'utf8'), {
  filename: 'less/jgrowl.less',
});
const compressed = new CleanCSS({ level: 1, compatibility: 'ie8' }).minify(stylesheet.css);
if (compressed.errors.length) throw new Error(compressed.errors.join('\n'));
await Promise.all([
  writeFile('jquery.jgrowl.min.js', `${javascript.code}\n`),
  writeFile('jquery.jgrowl.map', javascript.map),
  writeFile('jquery.jgrowl.css', stylesheet.css),
  writeFile('jquery.jgrowl.min.css', `${compressed.styles}\n`),
]);
