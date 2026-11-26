const tid = s => page.locator(`[data-testid="${s}"]`); const o = {};
let alerted = false; page.on('dialog', async d => { alerted = true; await d.dismiss(); });
await go('/approvals?list=decided&item=669bd5ba-66e8-4b19-b480-21ba2ff685f9'); await sleep(4000);
const det = (await tid('approval-detail').innerText().catch(() => '')); o.R12activity = det.slice(0, 1800);
o.scriptShownAsText = det.includes('<script>alert(1)</script>'); o.boldShownAsText = det.includes('<b>bold</b>'); o.alerted = alerted;
await shot('ui5-B-R12-activity');
await go('/approvals'); await sleep(3500);
o.ariaApprove = await page.locator('[data-testid^="approval-actions-"] button').first().getAttribute('aria-label').catch(() => null);
o.ariaReject = await page.locator('[data-testid^="approval-actions-"] button').nth(0).evaluate(e => e.getAttribute('aria-label')).catch(() => null);
o.statusText = await page.locator('[data-testid^="approval-row-"]').first().innerText().then(t => /Pending/.test(t)).catch(() => null);
// D10 keyboard next/prev
await page.locator('[data-testid^="approval-row-"]').first().click(); await sleep(2000);
const t1 = (await tid('approval-detail').innerText().catch(() => '')).split('\n').slice(0, 3).join(' / ');
for (const k of ['j', 'ArrowDown', 'n']) { await page.keyboard.press(k); await sleep(1500); const t2 = (await tid('approval-detail').innerText().catch(() => '')).split('\n').slice(0, 3).join(' / '); o['key_' + k] = t2 !== t1 ? 'moved -> ' + t2 : 'no change'; if (t2 !== t1) break; }
o.moveBtn = await page.locator('[data-testid^="approval-move-"]').count();
if (o.moveBtn) { o.moveLabels = await page.locator('[data-testid^="approval-move-"]').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim())); }
// N6 keyboard: Tab into the detail and focus
await page.keyboard.press('Escape'); await sleep(800); o.detailClosedByEsc = !(await tid('approval-detail').isVisible().catch(() => false));
return o;
