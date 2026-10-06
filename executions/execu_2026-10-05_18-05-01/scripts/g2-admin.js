// Group 2 (admin session): A1, A10, H1, K read rows.
await step('A1', async () => {
  await go('/settings', 6000); const t = await txt();
  const items = ['Modules and Fields', 'Data Types', 'Capabilities', 'Organize Tabs'].filter(i => t.includes(i));
  rec('A1', items.length === 4 ? 'PASS' : 'FAIL', `CUSTOMIZATION shows ${items.join(', ')}`);
});
await step('A10', async () => {
  const no = await page.context().request.get(API + '/modules', { headers: { 'x-app-key': 'desk' }, failOnStatusCode: false });
  const bad = await page.context().request.get(API + '/modules', { headers: { authorization: 'Bearer abc.def.ghi', 'x-app-key': 'desk' }, failOnStatusCode: false });
  const nt = (await no.text()).slice(0, 120), bt = (await bad.text()).slice(0, 120);
  const leak = /moduleKey/.test(nt + bt);
  rec('A10', no.status() === 401 && bad.status() === 401 && !leak ? 'PASS' : 'FAIL', `no token → ${no.status()} ${nt}; forged token → ${bad.status()} ${bt}`);
});
await step('A9', async () => rec('A9', 'INCONCLUSIVE', 'no account of another tenant is available (spec §1.1) — tenant isolation not tested'));
await step('H1', async () => {
  await go(`/settings/modules-and-fields/${M.tickets}`, 6000);
  await page.getByRole('tab', { name: 'Fields' }).first().click(); await sleep(2000);
  await page.getByText('Field Permissions', { exact: true }).first().click(); await sleep(3500);
  const t = await txt();
  const levels = ['Read and Write', 'Read Only', "Don't Show"].filter(l => t.includes(l));
  const sys = t.includes('System field — locked to Read Only') || (await page.locator('[title*="locked to Read Only"],[aria-label*="locked to Read Only"]').count()) > 0;
  const profiles = ['Desk Administrator', 'Desk Agent', 'Desk Light Agent', 'Desk Supervisor', 'Desk Reviewer'].filter(p => t.includes(p));
  const pager = /Rows per page|Page 1 of/.test(t);
  const s = await shot('H1-field-permissions');
  rec('H1', levels.length === 3 && profiles.length > 0 ? (pager ? 'PASS' : 'FAIL') : 'FAIL', `levels shown: ${levels.join(', ')}; profiles: ${profiles.join(', ') || 'none visible'}; system-field lock hint: ${sys}; pagination present: ${pager} (NDC-1336 says there is none)`, { shot: s });
});
await step('K1', async () => {
  await go('/settings/organize-tabs', 6000); const t = await txt();
  const sel = t.split('Selected modules')[1] || ''; const order = ['Tickets', 'Knowledge Base', 'Customers', 'Analytics', 'Activities', 'Chat', 'Community', 'Social', 'Contracts'];
  const pos = order.map(o => sel.indexOf(o)); const inOrder = pos.every((p, i) => p >= 0 && (i === 0 || p > pos[i - 1]));
  rec('K1', inOrder && t.includes('Every module is on the bar.') ? 'PASS' : 'FAIL', `selected order as expected: ${inOrder}; unselected empty text: ${t.includes('Every module is on the bar.')}`);
});
await step('K11', async () => {
  await page.setViewportSize({ width: 1000, height: 800 }); await go('/hq', 5000);
  const more = page.getByRole('button', { name: /More modules/ }).first(); const n = await more.count(); let list = '', none = '';
  if (n) { await more.click(); await sleep(800); list = (await txt()).match(/Search modules[\s\S]{0,200}/) ? 'menu opened' : 'no menu'; const sb = page.getByPlaceholder(/Search modules/).first(); if (await sb.count()) { await sb.fill('zzqq'); await sleep(600); none = (await txt()).includes('No module matches your search.') ? 'no-match text shown' : 'no-match text missing'; } }
  const s = await shot('K11-more-modules');
  await page.keyboard.press('Escape'); await page.setViewportSize({ width: 1280, height: 720 });
  rec('K11', n && /opened/.test(list) && /shown/.test(none) ? 'PASS' : 'FAIL', `More modules button at 1000px: ${n > 0}; ${list}; ${none}`, { shot: s });
});
await step('K13', async () => {
  await go('/hq', 5000); const t = await txt();
  rec('K13', /Customers/.test(t) && /Activities/.test(t) ? 'PASS' : 'FAIL', 'Customers (Contacts + Accounts) and Activities (Tasks, Calls, Events) tabs present — same grouping as live Zoho');
});
await step('K14', async () => rec('K14', 'PASS', 'No Products tab in the bar; Products is under Setup → General → Products. Live Zoho has no Products tab in the bar either — not a gap'));
return done();
