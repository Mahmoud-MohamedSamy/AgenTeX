const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V = 'caa66e4f-9c0b-4b1a-9f6e-ba96ac8fac5a'; const out = {};
const nm = r => ((r.data || []).find(f => f.field === 'first_name') || { value: {} }).value.value;
const crit = op => ({ pattern: '1 AND 2', conditions: [{ field: 'first_name', operator: 'starts_with', value: 'QA RT tz' }, { field: 'date_time', operator: op }] });
for (const op of ['today', 'yesterday', 'tomorrow']) {
  const g = await api('GET', '/modules/' + L + '/views/' + V);
  await api('PATCH', '/modules/' + L + '/views/' + V, { settings: { ...g.j.data.settings, columns: ['first_name', 'date_time', 'created_at'], criteria: crit(op) }, row_version: g.j.data.row_version });
  const r = await api('GET', '/modules/' + L + '/records?view_id=' + V + '&page=1&per_page=20');
  out['api_' + op] = JSON.stringify(arr(r.j && r.j.data).map(nm).sort());
  await page.goto(H + '/modules/' + L + '?view=' + V, { waitUntil: 'load', timeout: 90000 });
  for (let i = 0; i < 40; i++) { await sleep(1000); const t = await txt(); if (/QA RT tz-day/.test(t) && /\d+ records?/.test(t) && !/Loading/.test(t)) break; }
  await sleep(2500);
  out['ui_' + op] = (await page.locator('main').last().innerText().catch(() => '')).replace(/\s+/g, ' ').match(/QA RT tz-day.{0,40}|\d+ records?.{0,300}/g);
  await shot('NDC-2095-view-' + op);
}
return done(out);
