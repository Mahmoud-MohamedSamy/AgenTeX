await page.goto(H + '/views/all/tickets', { waitUntil: 'domcontentloaded', timeout: 90000 }); await sleep(4000);
const srcs = await page.evaluate(() => [...document.scripts].map(s => s.src).filter(Boolean));
const out = { srcs }; const pats = new Set();
const seen = new Set(); const queue = [...srcs];
while (queue.length && seen.size < 60) { const u = queue.shift(); if (seen.has(u)) continue; seen.add(u);
  const r = await page.context().request.get(u).catch(() => null); if (!r) continue; const t = await r.text();
  for (const m of t.matchAll(/["'`](\/(?:desk\/tickets|desk\/views|modules\/\$\{[^}]+\}\/views|ai|desk\/ai)[^"'`]{0,90})["'`]/g)) pats.add(m[1]);
  for (const m of t.matchAll(/(?:import\(|from\s*)["'](\.\/[^"']+\.js)["']/g)) { try { queue.push(new URL(m[1], u).href); } catch (e) {} }
  for (const m of t.matchAll(/["'](\/assets\/[^"']+\.js)["']/g)) queue.push(H + m[1]);
}
out.n = seen.size; out.pats = [...pats].filter(p => /split|ai|translat|clone|print|view|summar|triage|suggest|assist|kb|article|viewer|bulk|archive|merge/i.test(p)).sort();
return JSON.stringify(out);
