// Build para Vercel: copia el sitio a public/, compila Tailwind ahí y agrega ?v=<hash> al link del CSS.
// Cloudflare hace que el navegador guarde el CSS 4 h: sin el hash, una página nueva podría usar
// un CSS viejo al que le faltan clases. Los HTML del repo no se modifican.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const NO_PUBLICAR = new Set(['node_modules', 'public', 'package.json', 'package-lock.json', 'tailwind.config.js', 'tailwind.input.css', 'build.mjs', 'vercel.json']);

rmSync('public', { recursive: true, force: true });
cpSync('.', 'public', { recursive: true, filter: src => src === '.' || !(basename(src).startsWith('.') || NO_PUBLICAR.has(src)) });
execFileSync('npx', ['tailwindcss', '-i', './tailwind.input.css', '-o', './public/tailwind.css', '--minify'], { stdio: 'inherit' });

const v = createHash('sha256').update(readFileSync('public/tailwind.css')).digest('hex').slice(0, 10);
for (const f of readdirSync('public').filter(f => f.endsWith('.html'))) {
  const html = readFileSync(`public/${f}`, 'utf8');
  writeFileSync(`public/${f}`, html.replace(/href="\/tailwind\.css"/g, `href="/tailwind.css?v=${v}"`));
}
console.log(`public/tailwind.css?v=${v}`);
