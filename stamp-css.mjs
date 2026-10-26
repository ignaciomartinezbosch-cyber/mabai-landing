// En Vercel, agrega ?v=<hash del CSS> al link de /tailwind.css en cada página.
// Cloudflare hace que el navegador guarde el CSS 4 h: sin esto, una página nueva
// podría usar un CSS viejo al que le faltan clases. En local no toca nada.
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

if (!process.env.VERCEL) process.exit(0);
const v = createHash('sha256').update(readFileSync('tailwind.css')).digest('hex').slice(0, 10);
for (const f of readdirSync('.').filter(f => f.endsWith('.html'))) {
  const html = readFileSync(f, 'utf8');
  writeFileSync(f, html.replace(/href="\/tailwind\.css(\?v=[0-9a-f]+)?"/g, `href="/tailwind.css?v=${v}"`));
}
console.log(`tailwind.css?v=${v}`);
