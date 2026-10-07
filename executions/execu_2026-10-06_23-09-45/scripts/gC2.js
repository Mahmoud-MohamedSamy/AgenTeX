const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
await step('E2E-2.ui', async () => {
  await go(`/modules/${OPEN}`, 8000); await page.mouse.click(678, 28); await sleep(1200); await page.getByText('QA MF Open1', { exact: true }).last().click(); await sleep(4000);
  const dd = page.locator('select').filter({ has: page.locator('option', { hasText: 'QA MF L-Agent' }) }).first(); let how = '';
  if (await dd.count()) { how = 'select'; const opts = await dd.evaluate(e => [...e.options].map(o => o.text)); how += ' ' + opts.join('/'); await dd.selectOption({ label: 'QA MF L-Agent' }); }
  else { await page.getByRole('button', { name: /^Default/ }).first().click().catch(() => { }); await sleep(700); const o = page.getByText('QA MF L-Agent', { exact: true }).last(); how = 'custom ' + (await page.getByRole('option').allInnerTexts()).join('/'); await o.click().catch(() => { }); }
  await sleep(3000); const sec = (await page.getByText('QA MF E2E section', { exact: true }).count()) > 0; const serB = (await page.getByText('QA MF e2e_serial', { exact: true }).count()) > 0;
  const row = page.getByText('QA MF e2e_kind', { exact: true }).first().locator('xpath=ancestor::*[.//*[@role="combobox"] or .//select or .//button[contains(.,"Select")]][1]');
  const s = row.locator('select'); if (await s.count()) await s.first().selectOption('Hardware'); else { await row.locator('[role=combobox], button').first().click().catch(() => { }); await sleep(600); await page.getByText('Hardware', { exact: true }).last().click().catch(() => { }); }
  await sleep(1500); const serA = (await page.getByText('QA MF e2e_serial', { exact: true }).count()) > 0;
  const nm = page.getByPlaceholder('Name').first(); if (await nm.count()) await nm.fill('QA MF E2E agent form');
  await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(3000); const msg = ((await txt()).replace(/\s+/g, ' ').match(/[^.]{0,60}(required|must|is missing)[^.]{0,60}/i) || ['no message'])[0];
  const sh = await shot('E2E-2-agent-L-Agent');
  const editLink = await page.getByText('Edit Page Layout').count();
  rec('E2E-2.ui', 'INFO', `layout dropdown (${how}); E2E section shown after choosing L-Agent=${sec}; serial visible before Hardware=${serB}, after=${serA}; Save without serial → "${msg}"; url after save ${page.url().replace(H, '')}; "Edit Page Layout" link visible to agent=${editLink > 0}`, { shot: sh });
  if (editLink) { await go(`/modules/${OPEN}`, 6000); }
});
await step('A6b', async () => {
  await go(`/modules/${OPEN}`, 8000); await page.mouse.click(678, 28); await sleep(1200); await page.getByText('QA MF Open1', { exact: true }).last().click(); await sleep(4000);
  await page.getByText('Edit Page Layout').first().click().catch(() => { }); await sleep(5000);
  const t = (await txt()).replace(/\s+/g, ' '); const s = await shot('A6b-agent-edit-page-layout');
  rec('A6b', /permission|not allowed|denied/i.test(t) || !/NEW SECTION|New Fields/.test(t) ? 'PASS' : 'FAIL', `agent clicks "Edit Page Layout" → url ${page.url().replace(H, '')}; builder shown=${/NEW SECTION|New Fields/.test(t)}; message "${(t.match(/[^.]{0,40}(permission|not allowed|denied)[^.]{0,40}/i) || [''])[0]}"`, { shot: s });
});
return done();
