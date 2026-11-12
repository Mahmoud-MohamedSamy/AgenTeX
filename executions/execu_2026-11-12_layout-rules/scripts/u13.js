async (page) => {
  const mid = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  const R = {};
  const goList = async () => { await page.goto(HOST + '/settings/modules-and-fields/' + mid + '?tab=layout-rules', { waitUntil: 'domcontentloaded' }); await sleep(6000); };
  await goList();
  // B5 switch vip off
  const sw = page.getByRole('switch', { name: 'Active: QA LR1112 vip' }); R.swCount = await sw.count();
  if (R.swCount) { R.before = await sw.getAttribute('aria-checked'); await sw.click(); await sleep(2500); R.after = await sw.getAttribute('aria-checked'); R.toast = (await bodyText()).match(/(updated|saved|deactivated|activated|disabled|could not)[^.]{0,60}/i)?.[0]; }
  // H2b in UI: switch on the disabled duplicate 'QA LR1112 inactive'
  const sw2 = page.getByRole('switch', { name: 'Active: QA LR1112 inactive' }); if (await sw2.count()) { await sw2.click(); await sleep(2500); R.H2b_ui = (await bodyText()).match(/.{0,40}already uses.{0,80}/)?.[0] || 'no message'; R.H2b_state = await sw2.getAttribute('aria-checked'); await shot('crm-H2b-toggle', false); }
  // B3 search
  const s = page.getByPlaceholder('Search rules'); if (await s.count()) { await s.fill('tier'); await sleep(1500); R.B3_rows = await page.locator('tbody tr').count(); R.B3_text = (await page.locator('tbody').innerText()).replace(/\s+/g, ' ').slice(0, 120); await s.fill('zzzz'); await sleep(1200); R.B3_none = (await bodyText()).includes('No rules match these filters.'); await s.fill(''); await sleep(1000); }
  // B6 delete inactive with cancel then confirm
  const del = page.getByRole('button', { name: 'Delete QA LR1112 inactive' }); R.delCount = await del.count();
  if (R.delCount) { await del.click(); await sleep(1000); R.B6_dialog = (await page.locator('[role=dialog],[role=alertdialog]').last().innerText()).replace(/\s+/g, ' '); await page.getByRole('button', { name: 'Cancel' }).last().click(); await sleep(1000); R.B6_afterCancel = await page.getByRole('button', { name: 'Delete QA LR1112 inactive' }).count();
    await del.click(); await sleep(1000); await page.getByRole('button', { name: 'Delete', exact: true }).last().click(); await sleep(2500); R.B6_afterDelete = await page.getByRole('button', { name: 'Delete QA LR1112 inactive' }).count(); }
  await shot('crm-B-list', false);
  return R;
}
