// NDC-1602: Empty Bin again on the 16 forbidden leftovers; capture every toast/banner text and the server answers.
await page.evaluate(() => { window.__msgs = []; const seen = new Set(); new MutationObserver(() => { document.querySelectorAll('[role=status],[role=alert],[data-sonner-toast],[class*=toast],[class*=Toast],[class*=banner],[class*=Banner]').forEach(e => { const t = e.innerText.trim(); if (t && !seen.has(t)) { seen.add(t); window.__msgs.push({ t, at: Date.now() }); } }); }).observe(document.body, { subtree: true, childList: true, characterData: true }); });
const net = []; const onRs = async r => { if (/recycle-bin\/delete/.test(r.url())) { const j = await r.json().catch(() => null); net.push({ s: r.status(), ok: j?.data?.succeeded?.length, failed: j?.data?.failed?.length, reasons: [...new Set((j?.data?.failed || []).map(f => f.reason_key))] }); } };
page.on('response', onRs);
await page.getByText('Empty Bin', { exact: true }).first().click(); await sleep(1200);
const d = page.locator('[role=dialog],[role=alertdialog]').last(); await d.locator('input').first().fill('DELETE'); await d.getByRole('button', { name: 'Empty Bin' }).click();
const t0 = Date.now(); const snaps = [];
for (const w of [1500, 3000, 5000, 10000]) { await sleep(w); snaps.push({ s: Math.round((Date.now() - t0) / 1000), lines: (await txt()).split('\n').filter(l => /working|deleting|removed|deleted|failed|could|couldn|items|permission|error/i.test(l)).slice(0, 6) }); if (snaps.length === 2) await shot('1602-r2-08-second-run'); }
await shot('1602-r2-09-second-run-end');
page.off('response', onRs);
const msgs = await page.evaluate(() => window.__msgs.map(m => m.t));
return done({ net, snaps, msgs });
