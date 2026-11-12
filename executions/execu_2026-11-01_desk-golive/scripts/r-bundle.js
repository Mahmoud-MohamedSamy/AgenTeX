await page.goto(H + '/views/all/tickets', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(6000);
const srcs = await page.evaluate(() => [...[...document.scripts].map(s => s.src), ...[...document.querySelectorAll('link[rel=modulepreload]')].map(l => l.href), ...performance.getEntriesByType('resource').map(e => e.name).filter(n => /\.js(\?|$)/.test(n))].filter(Boolean));
const pats = new Set(); const seen = new Set(); const queue = [...srcs];
while (queue.length && seen.size < 120) { const u = queue.shift(); if (seen.has(u)) continue; seen.add(u);
  const r = await page.context().request.get(u).catch(() => null); if (!r) continue; const t = await r.text();
  for (const m of t.matchAll(/["'`](\/[a-z\-\/${}.]*(?:signature|split|inbound|incoming|upload-limit|max-file|recycle|purge|permanent)[^"'`]{0,80})["'`]/gi)) pats.add(m[1]);
  for (const m of t.matchAll(/["'`](?:\.\.?\/|\/)?((?:assets\/)?[A-Za-z0-9_\-.]+\.js)["'`]/g)) { try { const h = new URL(m[1].startsWith('assets/') ? '/' + m[1] : m[1], u).href; if (h.startsWith(H)) queue.push(h); } catch (e) {} }
}
return JSON.stringify({ n: seen.size, pats: [...pats].sort() });
