await step('BIN.ui', async () => {
  const resp = []; const f = async r => { if (/recycle-bin/.test(r.url()) && r.request().method() !== 'GET') resp.push(r.request().method() + ' ' + r.url().replace(API, '') + ' ' + (r.request().postData() || '').slice(0, 120) + ' → ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 220)); };
  page.on('response', f); await go('/settings/data/recycle-bin', 8000);
  const row = page.locator('tr', { hasText: 'QA MF Dept' }).first(); await row.locator('button').last().click(); await sleep(900);
  const items = await page.locator('[role=menuitem]').allInnerTexts();
  const d = page.locator('[role=menuitem]').filter({ hasText: /Delete|permanent/i }).first(); if (await d.count()) { await d.click(); await sleep(1000); const c = page.getByRole('button', { name: /Delete|Confirm|Yes/ }).last(); if (await c.count()) await c.click(); await sleep(3000); }
  const msg = ((await txt()).replace(/\s+/g, ' ').match(/[^.]{0,60}(deleted|could not|failed|not supported|error)[^.]{0,80}/i) || [''])[0]; const s = await shot('BIN-ui-delete'); page.off('response', f);
  rec('BIN.ui', 'INFO', `row menu ${JSON.stringify(items)}; message "${msg}"; calls ${resp.join(' || ')}`, { shot: s });
});
return done();
