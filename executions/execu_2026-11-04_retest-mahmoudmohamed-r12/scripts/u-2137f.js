// NDC-2137 r12: Transactions Kanban "Kanban View" (opened once with the Kanban view button, preference kept). 1 warm-up + 20 reloads.
// t = navigation start → every column total shows an Amount AND at least one card (record link) is on the board.
const o = { runs: [], frame: [] }; const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
await page.goto(H + '/modules/' + D, { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 60; i++) { await sleep(2000); if (await page.locator('[data-testid=board-column-total]').count()) break; }
const ready = () => page.evaluate(() => { const tot = [...document.querySelectorAll('[data-testid=board-column-total]')]; const ok = tot.length > 0 && tot.every(e => /\d/.test(e.innerText)); const cards = document.querySelectorAll('[data-testid=board-column-caption]').length > 0 && [...document.querySelectorAll('a[href*="/records/"], [data-testid*=card i]')].length > 0; return { ok: ok && cards, cols: tot.length }; }).catch(() => ({ ok: false }));
for (let k = 0; k <= 20; k++) {
  const t0 = Date.now(); await page.reload({ waitUntil: 'commit', timeout: 120000 }); let frame = null, done = null, cols = 0;
  for (let i = 0; i < 1200; i++) { await page.waitForTimeout(100); if (!frame && /Transactions/.test(await page.innerText('body').catch(() => ''))) frame = Date.now() - t0; const r = await ready(); if (r.ok) { done = Date.now() - t0; cols = r.cols; break; } }
  if (k === 0) { o.warmup = done; continue; } o.runs.push(done ?? '>120000'); o.frame.push(frame); o.cols = cols;
  if (k === 1) await shot('2137-e-board-timed.png');
}
const v = o.runs.filter(x => typeof x === 'number').sort((a, b) => a - b); const pct = p => v[Math.min(v.length - 1, Math.ceil(p / 100 * v.length) - 1)];
o.stats = { n: v.length, min: v[0], p50: pct(50), p95: pct(95), max: v[v.length - 1] };
const fr = o.frame.filter(Boolean).sort((a, b) => a - b); o.frameStats = { p50: fr[Math.ceil(fr.length / 2) - 1], max: fr[fr.length - 1] };
return o;
