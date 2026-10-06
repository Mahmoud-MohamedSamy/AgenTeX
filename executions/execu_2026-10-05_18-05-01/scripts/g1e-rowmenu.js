// B8 follow-up: open each Tickets row-menu item read-only (Escape out of every dialog, never confirm).
const out = [];
for (const item of ['Set Validation Rules', 'Map Dependency Fields', 'Button', 'Links', 'Access Control', 'Assignment Rules', 'Delete']) {
  await go('/settings/modules-and-fields', 5000);
  const row = page.locator('tr', { hasText: 'Tickets' }).first(); await row.hover(); await sleep(300);
  await row.locator('button.mf-row-menu-btn, button[aria-label^="Open menu for"]').first().click(); await sleep(700);
  await page.getByText(item, { exact: true }).last().click(); await sleep(3500);
  const url = page.url().replace(H, ''); const t = (await txt());
  const dlg = await page.locator('[role=dialog], [role=alertdialog]').last().innerText().catch(() => '');
  const crash = /Something went wrong|Cannot read/.test(t);
  const key = item.replace(/\W+/g, '-');
  const s = await shot('B8-' + key);
  out.push({ item, url, dialog: dlg.replace(/\s+/g, ' ').slice(0, 220), crash, snippet: t.replace(/\s+/g, ' ').split('Storage Requests').slice(-1)[0].slice(0, 220), shot: s });
  await page.keyboard.press('Escape'); await sleep(500);
}
for (const o of out) rec('B8.' + o.item, o.crash ? 'FAIL' : 'INFO', `url ${o.url}; dialog: "${o.dialog}"; page: "${o.snippet}"`, { shot: o.shot });
// prove nothing changed
const m = (await api('GET', `/modules/${M.tickets}`)).j.data;
rec('B8.after', m.status === 'active' ? 'PASS' : 'FAIL', `Tickets module still status=${m.status}, rowVersion=${m.rowVersion}`);
return done();
