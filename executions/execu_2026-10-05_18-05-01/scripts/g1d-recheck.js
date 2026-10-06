// B3 / B8 third pass: choose the list search by position (x > 280), read the row menu by text diff.
const rowsText = async () => (await page.locator('table tbody').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
await step('B3', async () => {
  await go('/settings/modules-and-fields');
  const ins = page.locator('input[placeholder="Search"]'); const n = await ins.count(); let box = null;
  for (let i = 0; i < n; i++) { const bb = await ins.nth(i).boundingBox(); if (bb && bb.x > 280) { box = ins.nth(i); break; } }
  if (!box) throw new Error('list search box not found');
  const q = async s => { await box.fill(s); await sleep(1500); return rowsText(); };
  const a = await q('tick'), b = await q('TICK'), c = await q('تذاكر'), d = await q('zzqqxx');
  const main = await txt(); const empty = (main.match(/No (module|modules|results|records|matching)[^\n]{0,60}/i) || [''])[0];
  const onlyTickets = a.includes('Tickets') && !/Contacts|Accounts|Products|Calls|Events|Contracts|Time Entries/.test(a);
  const ok = onlyTickets && b.includes('Tickets') && !c.includes('Tickets') && !/Tickets|Contacts/.test(d);
  rec('B3', ok ? 'PASS' : 'FAIL', `"tick": [${a.slice(0, 60)}]; "TICK" finds Tickets: ${b.includes('Tickets')}; Arabic rows: [${c.slice(0, 30)}]; nonsense rows: [${d.slice(0, 30)}]; empty-state: "${empty}"`, ok ? {} : { shot: await shot('B3-search') });
  await box.fill(''); await sleep(800);
});
await step('B8', async () => {
  await go('/settings/modules-and-fields');
  const out = [];
  for (const name of ['Tickets', 'Calls']) {
    const before = await txt();
    const row = page.locator('tr', { hasText: name }).first(); await row.hover(); await sleep(400);
    const btn = row.locator('button.mf-row-menu-btn, button[aria-label^="Open menu for"]').first();
    if (!(await btn.isVisible().catch(() => false))) { out.push(`${name}: no visible menu button`); continue; }
    await btn.click(); await sleep(900);
    const menu = page.locator('[role=menu], [role=listbox], .mf-menu, [data-radix-popper-content-wrapper]').last();
    let items = (await menu.innerText().catch(() => '')).split('\n').map(s => s.trim()).filter(Boolean);
    if (!items.length) { const after = await txt(); items = after.split('\n').filter(l => !before.includes(l)).map(s => s.trim()).filter(Boolean); }
    if (name === 'Tickets') await shot('B8-tickets-row-menu');
    out.push(`${name}: [${items.join(' | ')}]`); await page.keyboard.press('Escape'); await sleep(400);
  }
  const s = out.join(' ; '); const lcm = /Lead Conversion/.test(s);
  rec('B8', lcm ? 'FAIL' : 'PASS', s + `; "Lead Conversion Mapping" shown: ${lcm}`);
});
return done();
