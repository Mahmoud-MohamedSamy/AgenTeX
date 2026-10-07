const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
let L = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data); const nl = L.find(l => l.name === 'New Layout');
if (nl) { const g = (await api('GET', `/modules/${OPEN}/layouts/${nl.id}`)).j.data; const b = { ...g, name: 'QA MF L-Agent' }; delete b.id; await api('PUT', `/modules/${OPEN}/layouts/${nl.id}`, b); }
L = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data); const la = L.find(l => l.name === 'QA MF L-Agent');
if (!L.find(l => l.name === 'QA MF L-Admin')) await api('POST', `/modules/${OPEN}/layouts/${la.id}/clone`, { name: 'QA MF L-Admin' });
L = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data);
const cap = []; const onW = r => { if (['POST','PUT','PATCH','DELETE'].includes(r.method()) && r.url().includes('/api/v1/') && !/heartbeat|resolved-batch|presence|/iam/auth/.test(r.url())) cap.push(r.method() + ' ' + r.url().replace(API, '') + ' ' + (r.postData() || '').slice(0, 200)); };
page.on('request', onW); const notes = [];
for (const [name, prof] of [['QA MF L-Agent', 'Desk Agent'], ['QA MF L-Admin', 'Desk Administrator']]) {
  const id = L.find(l => l.name === name).id;
  await go(`/settings/modules-and-fields/${OPEN}/layouts/${id}`, 9000);
  await page.getByText(name, { exact: true }).first().locator('xpath=following::button[1]').click(); await sleep(800);
  await page.getByText('Layout Permissions', { exact: true }).click(); await sleep(1800);
  const d = page.locator('[role=dialog]').last(); const dt = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ');
  if (name === 'QA MF L-Agent') await shot('G10-layout-permissions');
  const opt = d.getByText(prof, { exact: true }); const n = await opt.count(); if (n) { await opt.first().click(); await sleep(500); }
  await d.getByRole('button', { name: /^(Save|Apply|Done)$/ }).last().click().catch(e => notes.push('no save button')); await sleep(2500);
  notes.push(`${name}: dialog "${dt.slice(0, 280)}"; "${prof}" found=${n}`);
}
page.off('request', onW);
L = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data);
rec('G10.perm', 'INFO', notes.join(' || ') + ` ; layouts: ${L.map(l => l.name + ' ' + l.id + ' assigned=' + JSON.stringify(l.assignedProfiles) + ' access=' + l.accessMode + ' status=' + l.status).join(' ; ')}; writes ${cap.join(' || ').slice(0, 700)}`);
return done();
