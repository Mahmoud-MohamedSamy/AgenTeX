const urls = await page.evaluate(() => performance.getEntriesByType('resource').map(e => e.name).filter(u => /\.js(\?|$)/.test(u)));
const out = {};
for (const u of urls) { const r = await page.context().request.get(u).catch(() => null); if (!r) continue; const t = await r.text();
  let j = t.indexOf('ruleFacts.businessHours'); if (j >= 0 && !out.facts) out.facts = t.slice(j - 700, j + 50);
  j = t.indexOf('relatedFields'); let k = 0; while (j >= 0 && k < 4) { const s = t.slice(Math.max(0, j - 150), j + 250); if (!/moduleKey:`desk_tickets`,lookups/.test(s)) { out['rel' + k] = s; k++; } j = t.indexOf('relatedFields', j + 1); }
  j = t.indexOf('`CurrentTime`'); if (j < 0) j = t.indexOf('currentTime'); if (j >= 0 && !out.ct) out.ct = t.slice(j - 250, j + 250); }
return fin(out);
