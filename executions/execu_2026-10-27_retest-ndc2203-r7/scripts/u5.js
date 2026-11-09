const urls = await page.evaluate(() => performance.getEntriesByType('resource').map(e => e.name).filter(u => /\.js(\?|$)/.test(u)));
const ctx = []; const fs2 = [];
for (const u of urls) { const r = await page.context().request.get(u).catch(() => null); if (!r) continue; const t = await r.text();
  let i = -1; let k = 0; while ((i = t.indexOf('ticketEvents', i + 1)) >= 0 && k < 6) { ctx.push(t.slice(Math.max(0, i - 200), i + 300)); k++; }
  for (const w of ['commentPublic', 'followerUserIds', 'ticketLayoutId', 'skillKeys', 'relatedLookupField']) { const j = t.indexOf(w); if (j >= 0) fs2.push(w + ': ' + t.slice(Math.max(0, j - 250), j + 120)); } }
return done({ ctx, fs2: fs2.slice(0, 8) });
