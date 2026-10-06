// Group 1 re-checks (false-positive checklist): scope text to the table / tab, take evidence.
const rowsText = async () => (await page.locator('table tbody').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
await step('B3', async () => {
  await go('/settings/modules-and-fields');
  const box = page.getByPlaceholder('Search').first();
  const q = async s => { await box.fill(s); await sleep(1500); return rowsText(); };
  const a = await q('tick'), b = await q('TICK'), c = await q('تذاكر'), d = await q('zzqqxx');
  const full = await txt(); const empty = (full.match(/No [a-z][^\n]{0,60}/i) || [''])[0];
  const onlyTickets = a.includes('Tickets') && !/Contacts|Accounts|Products|Calls|Events|Tasks|Contracts|Time Entries/.test(a);
  const ok = onlyTickets && b.includes('Tickets') && !c.includes('Tickets') && !/Tickets|Contacts/.test(d);
  rec('B3', ok ? 'PASS' : 'FAIL', `table rows only — "tick": [${a.slice(0, 80)}]; "TICK": ${b.includes('Tickets')}; Arabic: [${c.slice(0, 60)}]; nonsense: [${d.slice(0, 60)}]; empty-state text: "${empty}"`, ok ? {} : { shot: await shot('B3-search') });
  await box.fill(''); await sleep(800);
});
await step('B8', async () => {
  const btn = page.locator('button[aria-label="Open menu for Tickets"]').first();
  await btn.click(); await sleep(800);
  const items = await page.getByRole('menuitem').allInnerTexts();
  await page.keyboard.press('Escape'); await sleep(300);
  const b2 = page.locator('button[aria-label="Open menu for Contacts"]').first(); await b2.click(); await sleep(800);
  const items2 = await page.getByRole('menuitem').allInnerTexts(); await page.keyboard.press('Escape');
  const lcm = [...items, ...items2].some(i => /Lead Conversion/.test(i));
  rec('B8', lcm ? 'FAIL' : 'PASS', `Tickets menu: [${items.join(' | ')}]; Contacts menu: [${items2.join(' | ')}]; "Lead Conversion Mapping" shown: ${lcm}`);
});
await step('E4', async () => {
  await go(`/settings/modules-and-fields/${M.tickets}`);
  const tab = page.getByRole('tab', { name: 'Workflow Rules' });
  const n = await tab.count(); if (n) await tab.first().click(); else await page.locator('main').getByText('Workflow Rules', { exact: true }).first().click();
  await sleep(3000); const t = await page.locator('main').innerText().catch(() => txt());
  const nb = await page.locator('main').getByRole('button', { name: /New Rule/ }).count();
  const ok = /No workflow rules yet/.test(t) || /Trigger/.test(t);
  rec('E4', ok && nb > 0 ? 'PASS' : 'FAIL', `tab found by role=${n > 0}; url ${page.url().replace(H, '')}; empty-state or list=${ok}; New Rule buttons=${nb}`, ok && nb ? {} : { shot: await shot('E4-workflow-tab') });
});
await step('F8', async () => {
  await go(`/modules/${M.tickets}/records/new`, 8000);
  const vals = await page.evaluate(() => [...document.querySelectorAll('input,select,button,[role=combobox]')].map(e => (e.value || e.innerText || '').trim()).filter(v => v && v.length < 30));
  const raw = vals.filter(v => /^(low|medium|high|urgent|email|phone|web|question|problem|english|arabic)$/.test(v));
  const s = await shot('F8-new-ticket-form');
  rec('F8', raw.length ? 'FAIL' : 'PASS', `new-ticket form control values: raw keys shown: ${[...new Set(raw)].join(', ') || 'none'}; url ${page.url().replace(H, '')}`, { shot: s });
});
await step('F10', async () => {
  await go(`/settings/modules-and-fields/${M.tickets}`);
  const ft = page.getByRole('tab', { name: 'Fields' }); if (await ft.count()) await ft.first().click(); else await page.locator('main').getByText('Fields', { exact: true }).first().click();
  await sleep(2500);
  const b = page.getByRole('button', { name: /Create and Edit Fields/ }); const n = await b.count();
  if (n) { await b.first().click(); await sleep(6000); }
  const url = page.url().replace(H, ''); const t = await txt();
  const opened = /\/layouts\//.test(url) || /New Fields|Unused Fields/.test(t) || /Select Layout|Select a layout/.test(t);
  rec('F10', opened ? 'PASS' : 'FAIL', `button found=${n}; after click url=${url}; builder or layout picker shown=${opened}`, opened ? {} : { shot: await shot('F10-create-edit-fields') });
  await page.keyboard.press('Escape');
});
return done();
