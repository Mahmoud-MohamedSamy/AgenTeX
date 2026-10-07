const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
const cap = []; const onW = r => { if (['POST','PUT','PATCH','DELETE'].includes(r.method()) && r.url().includes('/api/v1/') && !/heartbeat|resolved-batch|presence|/iam/auth/.test(r.url())) cap.push(r.method() + ' ' + r.url().replace(API, '') + ' ' + (r.postData() || '').slice(0, 250)); };
page.on('request', onW);
const out = [];
for (const [name, prof] of [['QA MF L-Agent', 'Desk Agent'], ['QA MF L-Admin', 'Desk Administrator']]) {
  await go(`/settings/modules-and-fields/${OPEN}`, 6000);
  await page.getByRole('tab', { name: 'Layouts' }).first().click(); await sleep(1500);
  await page.getByRole('button', { name: /Create New Layout/ }).click(); await sleep(1800);
  const dtxt = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
  if (name === 'QA MF L-Agent') await shot('G10-create-layout-dialog');
  const nameInp = page.locator('[role=dialog] input[type=text], [role=dialog] input:not([type])').first(); await nameInp.fill(name);
  const pl = page.locator('[role=dialog]').last().getByText(prof, { exact: true }); const pc = await pl.count(); if (pc) { await pl.first().click(); await sleep(400); }
  const go1 = page.locator('[role=dialog]').last().getByRole('button', { name: /^(Create|Next|Continue|Save)/ }).last(); await go1.click(); await sleep(5000);
  out.push(`${name}: dialog "${dtxt.slice(0, 260)}"; profile label found=${pc}; url after ${page.url().replace(H, '')}`);
  const sv = page.getByRole('button', { name: /^Save and Close$/ }); if (await sv.count()) { await sv.click(); await sleep(3500); }
}
page.off('request', onW);
const L = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data);
rec('G10.setup', 'INFO', out.join(' || ') + ` ; layouts now: ${L.map(l => l.name + ' ' + l.id + ' assigned=' + JSON.stringify(l.assignedProfiles) + ' status=' + l.status).join(' ; ')}; writes: ${cap.join(' || ').slice(0, 900)}`);
return done();
