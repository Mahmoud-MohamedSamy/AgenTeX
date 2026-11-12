async (page) => {
  const A = globalThis.__APP; const R = {};
  const MID = A === 'desk' ? '88e8ea44-1658-4df3-9930-d0902b91073d' : '841043e1-c078-41f9-8d6e-dfd61bee45c3';
  const fresh = async () => { await page.goto(HOST + '/settings/modules-and-fields/' + MID + '?tab=validation', { waitUntil: 'domcontentloaded' }); await sleep(5000); if (await relogin()) { await page.goto(HOST + '/settings/modules-and-fields/' + MID + '?tab=validation'); await sleep(5000); } await page.getByRole('button', { name: /new rule/i }).first().click(); await sleep(2000); };
  const dlg = () => page.locator('[role=dialog]').last();
  const btn = (label) => dlg().getByRole('button', { name: label, exact: true }).first();
  const choose = async (label, text) => { await btn(label).click(); await sleep(900); const o = page.getByRole('option').filter({ hasText: text }).first(); if (!(await o.count())) { return 'no option'; } const dis = await o.getAttribute('aria-disabled'); const t = (await o.innerText()).replace(/\s+/g, ' '); await o.click({ force: true }).catch(() => {}); await sleep(1500); return t + ' | disabled=' + dis; };
  const cond = async () => { const t = (await dlg().innerText()).replace(/\s+/g, ' '); const i = t.indexOf('SHOW THE ERROR'); return t.slice(i, i + 900); };
  const ops = async () => { const b = dlg().getByRole('button', { name: /operator|is|equals/i }); return await dlg().evaluate(d => [...d.querySelectorAll('button,select,input')].map(e => (e.getAttribute('aria-label') || '') + '=' + (e.innerText || e.value || '').trim().slice(0, 30)).filter(s => s.length > 1).slice(-25)); };
  const cases = A === 'desk' ? [['QA VR1112 Layout', 'QA VR1112 chk'], ['QA VR1112 Layout', 'Status'], ['QA VR1112 Layout', 'Contact']] : [['All layouts', 'Lookup'], ['QA VR1112 Layout', 'QA VR1112 chk'], ['QA VR1112 Layout', 'Lead Status'], ['All layouts', 'Lead Owner']];
  for (const [lay, f] of cases) {
    await fresh(); if (lay !== 'All layouts') await choose('Layout', lay);
    const k = lay.slice(0, 3) + ':' + f;
    R[k] = await choose('Field to check', f);
    R[k + ' cond'] = await cond();
    R[k + ' ctrls'] = await ops();
    await shot(A + '-Z-' + f.replace(/\W+/g, '_'), false);
  }
  return R;
}
