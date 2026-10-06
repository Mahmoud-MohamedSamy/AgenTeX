// B3 / B8 re-check scoped to the main panel.
const rowsText = async () => (await page.locator('main table tbody, table tbody').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
await step('B3', async () => {
  await go('/settings/modules-and-fields');
  const inputs = page.locator('main input[placeholder="Search"]');
  const n = await inputs.count(); const box = n ? inputs.first() : page.getByPlaceholder('Search').nth(1);
  const q = async s => { await box.fill(s); await sleep(1500); return rowsText(); };
  const a = await q('tick'), b = await q('TICK'), c = await q('تذاكر'), d = await q('zzqqxx');
  const full = await page.locator('main').innerText().catch(() => ''); const empty = (full.match(/No [a-z][^\n]{0,60}/i) || [''])[0];
  const onlyTickets = a.includes('Tickets') && !/Contacts|Accounts|Products|Calls|Events|Contracts|Time Entries/.test(a);
  const ok = onlyTickets && b.includes('Tickets') && !c.includes('Tickets') && !/Tickets|Contacts/.test(d);
  rec('B3', ok ? 'PASS' : 'FAIL', `main search inputs=${n}; "tick": [${a.slice(0, 60)}]; "TICK" finds Tickets: ${b.includes('Tickets')}; Arabic: [${c.slice(0, 40)}]; nonsense: [${d.slice(0, 40)}]; empty-state: "${empty}"`, ok ? {} : { shot: await shot('B3-search') });
  await box.fill(''); await sleep(800);
});
await step('B8', async () => {
  await go('/settings/modules-and-fields');
  const out = [];
  for (const name of ['Tickets', 'Contacts', 'Calls']) {
    const row = page.locator('tr', { hasText: name }).first(); await row.hover(); await sleep(500);
    const btn = row.locator('button.mf-row-menu-btn, button[aria-label^="Open menu for"]').first();
    const vis = await btn.isVisible().catch(() => false);
    if (!vis) { out.push(`${name}: menu button not visible`); continue; }
    await btn.click(); await sleep(800);
    const items = await page.getByRole('menuitem').allInnerTexts();
    out.push(`${name}: [${items.join(' | ')}]`); await page.keyboard.press('Escape'); await sleep(400);
  }
  const s = out.join(' ; '); const lcm = /Lead Conversion/.test(s);
  rec('B8', /not visible/.test(s) && !/\[/.test(s) ? 'INCONCLUSIVE' : (lcm ? 'FAIL' : 'PASS'), s + `; "Lead Conversion Mapping" shown: ${lcm}`);
});
return done();
