async (page) => {
  const A = globalThis.__APP; const R = {};
  const MID = A === 'desk' ? '88e8ea44-1658-4df3-9930-d0902b91073d' : '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  const LAY = 'QA VR1112 Layout';
  const fresh = async () => { await page.goto(HOST + '/settings/modules-and-fields/' + MID + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(5000); if (await relogin()) { await page.goto(HOST + '/settings/modules-and-fields/' + MID + '?tab=validation'); await sleep(5000); } await page.getByRole('button', { name: /new rule/i }).first().click(); await sleep(2000); };
  const dlg = () => page.locator('[role=dialog]').last();
  const btn = (label) => dlg().getByRole('button', { name: label, exact: true }).first();
  const choose = async (label, text) => { await btn(label).click(); await sleep(900); const o = page.getByRole('option').filter({ hasText: text }).first(); if (!(await o.count())) { await dlg().locator('h2').first().click({ force: true }).catch(() => {}); return 'no option'; } const dis = await o.getAttribute('aria-disabled'); const t = (await o.innerText()).replace(/\s+/g, ' '); await o.click({ force: true }).catch(() => {}); await sleep(1200); return t + ' | disabled=' + dis; };
  const QA = A === 'desk' ? ['QA VR1112 chk', 'Status', 'Contact Name'] : ['QA VR1112 chk', 'Connected To', 'Lead Status'];
  await fresh(); R.layout = await choose('Layout', LAY);
  await btn('Field to check').click(); await sleep(900);
  R.options = await page.evaluate(() => [...document.querySelectorAll('[role=option]')].map(o => o.innerText.replace(/\s+/g, ' ').trim() + (o.getAttribute('aria-disabled') === 'true' ? ' [disabled]' : '')).filter(t => /QA VR1112|Connected|Status|Lookup|Contact|Account|Product|Email Opt|Checkbox|Team|Department|Owner/i.test(t)));
  await shot(A + '-C3-fields', false);
  for (const f of QA) {
    await fresh(); await choose('Layout', LAY);
    R['pick ' + f] = await choose('Field to check', f);
    R['after ' + f] = (await dlg().innerText()).replace(/\s+/g, ' ').match(/FIELD TO CHECK.{0,300}/)?.[0];
  }
  await shot(A + '-Z1-editor', false);
  return R;
}
