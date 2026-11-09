const urls = await page.evaluate(() => performance.getEntriesByType('resource').map(e => e.name).filter(u => /\.js(\?|$)/.test(u)));
const out = {};
for (const u of urls) { const r = await page.context().request.get(u).catch(() => null); if (!r) continue; const t = await r.text();
  for (const w of ['`ExecutionTime`', '`execution_time`', '`NotBetween`', '`Between`', '`CurrentTime`', '`current_time`', '`NotContains`', '`DoesNotContain`', 'relatedField', '`RelatedField`', 'businessHoursProfile', '`Holiday`', '`DuringBusinessHours`'])
    { if (out[w]) continue; const j = t.indexOf(w); if (j >= 0) out[w] = t.slice(Math.max(0, j - 220), j + 220); } }
return fin(out);
