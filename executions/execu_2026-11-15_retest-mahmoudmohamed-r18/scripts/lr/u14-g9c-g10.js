const R = { net: [] };
page.on('response', r => { const m = r.request().method(); if (m !== 'GET' && /api\/v1/.test(r.url()) && !/iam\/auth/.test(r.url())) R.net.push(m + ' ' + r.url().split('/api/v1')[1].slice(0, 100) + ' ' + r.status()); });
await openRec(DM, I.dealRec);
await page.getByRole('button', { name: /^Negotiation/ }).first().click();
const d = page.locator('[role=dialog]', { hasText: 'Review details' }).first(); await d.waitFor({ timeout: 15000 });
await d.locator('input').first().fill('QA RT18 approved'); await sleep(500); await shot('2976-2-review-filled.png'); R.bDlg = await box(d);
await d.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(5000);
R.dlgGone = !(await page.locator('[role=dialog]', { hasText: 'Review details' }).count());
await shot('2976-3-saved.png'); R.bStage = await box(page.getByRole('button', { name: /^Negotiation/ }).first());
// G10 blueprint transition
await openRec(MID, I.bpRec); await sleep(2000);
const tb = page.getByRole('button', { name: 'QA to Refund' }).first(); R.tb = await tb.count();
if (R.tb) { await tb.click(); await sleep(3000); const t = page.locator('[role=dialog]').first(); R.tdlg = await t.count(); if (R.tdlg) { R.tTxt = (await t.innerText()).replace(/\s+/g, ' ').slice(0, 700); R.orderInDlg = /QA RT18 order/.test(R.tTxt); R.bT = await box(t); R.bOrder = await box(t.getByText('QA RT18 order').first()); } await shot('2977-1-transition-dialog.png'); }
else R.btns = (await page.getByRole('button').allInnerTexts()).filter(s => /QA|Refund|transition/i.test(s));
return R;
