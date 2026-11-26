const tid = s => page.locator(`[data-testid="${s}"]`); const o = {};
let alerted = false; page.on('dialog', async d => { alerted = true; await d.dismiss(); });
const waitDet = async () => { for (let i = 0; i < 20; i++) { const t = await tid('approval-detail').innerText().catch(() => ''); if (t && !/Loading the approval/.test(t)) return t; await sleep(1000); } return await tid('approval-detail').innerText().catch(() => ''); };
await go('/approvals?list=decided&item=669bd5ba-66e8-4b19-b480-21ba2ff685f9'); 
const det = await waitDet(); o.R12activity = det.slice(0, 2500);
o.scriptShownAsText = det.includes('<script>alert(1)</script>'); o.boldShownAsText = det.includes('<b>bold</b>'); o.alerted = alerted;
await tid('approval-detail').evaluate(e => e.scrollTop = e.scrollHeight).catch(() => {}); await shot('ui6-B-R12-activity');
await go('/approvals'); await sleep(4000);
const row = page.locator('[data-testid^="approval-row-"]').first(); o.rowStatus = /Pending/.test(await row.evaluate(e => e.closest('tr') ? e.closest('tr').innerText : e.innerText));
await row.click(); const d1 = await waitDet(); const t1 = d1.split('\n').slice(0, 2).join(' / '); o.first = t1;
o.moveBtns = await page.locator('[data-testid^="approval-move-"]').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim()));
for (const k of ['ArrowDown', 'j', 'n', 'Alt+ArrowDown', 'PageDown']) { await page.keyboard.press(k); await sleep(2000); const t2 = (await waitDet()).split('\n').slice(0, 2).join(' / '); if (t2 !== t1) { o.keyMoved = k + ' -> ' + t2; break; } }
if (!o.keyMoved) o.keyMoved = 'no key moved';
const help = (await tid('approval-detail').innerText().catch(() => '')).match(/.{0,60}(next|previous|press|key).{0,60}/i); o.keyHint = help && help[0];
await shot('ui6-B-detail-nav');
return o;
