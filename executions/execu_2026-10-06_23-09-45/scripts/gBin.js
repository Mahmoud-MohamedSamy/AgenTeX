await step('BIN.purge', async () => {
  const list = async () => arr((await api('GET', '/audit/recycle-bin/items?app_key=desk&limit=100')).j.data);
  const it = (await list()).find(i => /QA MF/.test(JSON.stringify(i)));
  const p = await api('POST', '/audit/recycle-bin/delete', { ids: [it.id] }); const still = (await list()).some(i => i.id === it.id);
  const stop = capOn(); await go('/settings/security/recycle-bin', 7000); let url = page.url().replace(H, '');
  if (!/recycle/.test(url)) { await go('/settings', 6000); await page.getByText(/Recycle Bin/).first().click().catch(() => { }); await sleep(4000); url = page.url().replace(H, ''); }
  const s0 = await shot('BIN-page'); const btns = (await page.locator('button:visible').allInnerTexts()).map(x => x.trim()).filter(Boolean).slice(-15);
  // select the first QA row and delete permanently
  const row = page.locator('tr', { hasText: 'QA MF' }).first(); await row.locator('input[type=checkbox]').first().check().catch(() => { }); await sleep(600);
  const del = page.getByRole('button', { name: /Delete permanently|Permanently delete|Delete/ }).first(); let msg = ''; if (await del.count()) { await del.click().catch(() => { }); await sleep(1000); const c = page.getByRole('button', { name: /^(Delete|Delete permanently|Confirm|Yes)$/ }).last(); if (await c.count()) await c.click().catch(() => { }); await sleep(3000); msg = ((await txt()).replace(/\s+/g, ' ').match(/[^.]{0,40}(deleted|removed|failed|error)[^.]{0,60}/i) || [''])[0]; }
  stop(); const after = (await list()).filter(i => /QA MF/.test(JSON.stringify(i))).length;
  rec('BIN.purge', 'INFO', `API POST /audit/recycle-bin/delete {ids:[1]} → ${p.s} ${p.t.slice(0, 200)}; item still listed=${still}; UI page ${url}; buttons [${btns.join(' | ')}]; UI delete message "${msg}"; writes ${cap.join(' || ').slice(0, 400)}; QA items now ${after}`, { shot: s0 });
});
return done();
