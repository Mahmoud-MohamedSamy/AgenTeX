async (page) => {
  const R = {}; const MID = '88e8ea44-1658-4df3-9930-d0902b91073d';
  await page.goto(HOST + '/settings/modules-and-fields/' + MID + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await page.getByRole('button', { name: /new rule/i }).first().click(); await sleep(2000);
  const dlg = page.locator('[role=dialog]').last(); const btn = l => dlg.getByRole('button', { name: l, exact: true }).first();
  await btn('Layout').click(); await sleep(800); await page.getByRole('option').filter({ hasText: 'QA VR1112 Layout' }).first().click(); await sleep(1000);
  await btn('Field to check').click(); await sleep(900);
  R.statusOpts = await page.evaluate(() => [...document.querySelectorAll('[role=option]')].map(o => o.innerText.replace(/\s+/g, ' ').trim() + (o.getAttribute('aria-disabled') === 'true' ? ' [disabled]' : '')).filter(t => /status|account|product|team|department|owner|assign|priority|channel/i.test(t)));
  const st = page.getByRole('option', { name: /^Status$/ }).first(); R.exact = await st.count();
  if (R.exact) { await st.click({ force: true }); await sleep(1500); R.cond = (await dlg.innerText()).replace(/\s+/g, ' ').match(/CHECK STATUS.{0,80}/)?.[0]; await shot('desk-Z3-status', false); }
  // old rule edit view (J7 / B8)
  await page.goto(HOST + '/settings/modules-and-fields/' + MID + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(5000);
  await shot('desk-B8-list');
  const row = page.locator('tbody tr').filter({ hasText: 'QA NDC Reject needs a reason' }).first();
  await row.getByRole('button', { name: /edit/i }).first().click(); await sleep(2500);
  R.oldEditor = (await page.locator('[role=dialog]').last().innerText()).replace(/\s+/g, ' ').slice(0, 900); await shot('desk-J7-editor', false);
  return R;
}
