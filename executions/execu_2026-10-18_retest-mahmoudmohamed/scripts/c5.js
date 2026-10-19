// Cleanup step 5: permanently delete ONE QA RT item through the Recycle Bin UI and capture the request it sends.
const out = { calls: [] };
await go('/settings/data/recycle-bin', 9000);
const f = r => { const u = r.url(); if (u.includes('/api/') && r.method() !== 'GET' && !/\/iam\/auth|presence|heartbeat|notifications/.test(u)) out.calls.push(r.method() + ' ' + u.replace(API, '') + ' ' + (r.postData() || '').slice(0, 300)); };
page.on('request', f);
const s = page.getByPlaceholder(/Search/i).first(); if (await s.count()) { await s.fill('QA RT amt 15000'); await sleep(3000); }
const row = page.locator('tbody tr, [role=row]', { hasText: 'QA RT amt 15000' }).first(); out.row = await row.count();
if (out.row) { out.rowText = (await row.innerText()).replace(/\s+/g, ' ').slice(0, 150);
  await row.locator('button').last().click(); await sleep(900); out.menu = await page.locator('[role=menu] [role^=menuitem]').allInnerTexts();
  const pd = page.getByRole('menuitem', { name: /permanent|Delete/i }).first(); if (await pd.count()) { await pd.click(); await sleep(1200);
    out.confirm = (await page.locator('[role=alertdialog], [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
    const ok = page.locator('[role=alertdialog], [role=dialog]').last().getByRole('button', { name: /Delete|Confirm|Yes/i }).last(); if (await ok.count()) { await ok.click(); await sleep(3000); } } }
page.off('request', f); await shot('NDC-cleanup-bin');
return done(out);
