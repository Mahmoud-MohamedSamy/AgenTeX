const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = { shots: [] };
const crit = op => ({ pattern: '1 AND 2', conditions: [{ field: 'first_name', operator: 'starts_with', value: 'QA RT tz' }, { field: 'date_time', operator: op }] });
const p = await api('POST', '/modules/' + L + '/views', { name: 'QA RT tz-day', kind: 'list', visibility: 'private', settings: { columns: ['first_name', 'date_time', 'created_at'], criteria: crit('today') } });
const V = p.j && p.j.data && p.j.data.id; out.view = p.s + ' ' + (V || p.t.slice(0, 300)); if (!V) return done(out);
for (const op of ['today', 'yesterday', 'tomorrow']) {
  if (op !== 'today') { const g = await api('GET', '/modules/' + L + '/views/' + V); const body = { ...g.j.data, settings: { ...g.j.data.settings, criteria: crit(op) } };
    let u = await api('PATCH', '/modules/' + L + '/views/' + V, { settings: body.settings, row_version: g.j.data.row_version }); if (u.s >= 400) u = await api('PUT', '/modules/' + L + '/views/' + V, body); out['upd_' + op] = u.s + (u.s >= 400 ? ' ' + u.t.slice(0, 200) : ''); }
  await page.goto(H + '/modules/' + L + '?view=' + V, { waitUntil: 'load', timeout: 90000 }); await sleep(12000);
  out[op] = (await page.locator('tbody').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
  out.shots.push(await shot('NDC-2095-view-' + op));
}
return done(out);
