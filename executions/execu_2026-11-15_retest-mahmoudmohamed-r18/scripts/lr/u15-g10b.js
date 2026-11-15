const R = { net: [] };
page.on('response', r => { const m = r.request().method(); if (m !== 'GET' && /api\/v1/.test(r.url()) && !/iam\/auth|resolved-batch|realtime/.test(r.url())) R.net.push(m + ' ' + r.url().split('/api/v1')[1].slice(0, 100) + ' ' + r.status()); });
await openRec(MID, I.bpRec); await sleep(2000);
await page.getByRole('button', { name: 'QA to Refund' }).first().click(); await sleep(3000); const t = page.locator('[role=dialog]').first();
await t.getByRole('button', { name: 'Execute' }).click(); await sleep(2500); R.emptyTxt = (await t.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); R.stillOpen = await page.locator('[role=dialog]').count(); await shot('2977-2-execute-empty.png'); R.bT = await box(t); R.bErr = await box(t.getByText(/required/i).first());
const inp = t.locator('input:not([type=file])').first(); await inp.fill('QA RT18 G10 order'); await sleep(500);
await t.getByRole('button', { name: 'Execute' }).click(); await sleep(5000); R.closed = !(await page.locator('[role=dialog]').count());
await shot('2977-3-executed.png');
return R;
