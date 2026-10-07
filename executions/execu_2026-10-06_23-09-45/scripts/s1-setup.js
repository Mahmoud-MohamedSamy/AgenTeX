// Owner: create QA MF Open (Desk Administrator + Desk Agent) and QA MF Closed (Desk Administrator only) via the UI dialog; capture writes.
const cap = []; const onW = r => { if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(r.method()) && r.url().includes('/api/v1/') && !/heartbeat|presence/.test(r.url())) cap.push(`${r.method()} ${r.url().replace(API, '')} ${(r.postData() || '').slice(0, 400)}`); };
page.on('request', onW);
const mk = async (pl, si, profiles) => {
  await go('/settings/modules-and-fields', 6000); await page.getByRole('button', { name: /Create New Module/ }).click(); await sleep(1200);
  await page.getByPlaceholder('e.g. Tickets').fill(pl); await page.getByPlaceholder('e.g. Ticket', { exact: true }).fill(si);
  const dlg = page.locator('[role=dialog]').last();
  for (const p of profiles) { const lab = dlg.getByText(p, { exact: true }).first(); if (await lab.count()) await lab.click(); }
  await sleep(300); const checked = await dlg.locator('input[type=checkbox]').evaluateAll(cs => cs.map(c => c.checked));
  await page.getByRole('button', { name: /^Create$/ }).last().click(); await sleep(5000);
  return checked;
};
const c1 = await mk('QA MF Open', 'QA MF Open1', ['Desk Administrator', 'Desk Agent']);
const c2 = await mk('QA MF Closed', 'QA MF Closed1', ['Desk Administrator']);
page.off('request', onW);
const mods = arr((await api('GET', '/modules')).j.data).filter(m => /^QA MF/.test(m.pluralForm));
const perms = []; for (const m of mods) { const r = await api('GET', `/modules/${m.id}/permissions`); const a = await api('GET', `/acl/modules/${m.id}`); perms.push(`${m.pluralForm}: /permissions ${r.s}; ${r.t.slice(0, 160)}`); }
rec('S1', mods.length === 2 ? 'INFO' : 'FAIL', `checkboxes ticked: Open ${JSON.stringify(c1)}, Closed ${JSON.stringify(c2)}; modules ${mods.map(m => m.pluralForm + ' ' + m.id).join(', ')}; perms ${perms.join(' || ')}`, { writes: cap });
return done();
