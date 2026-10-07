const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
let L = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data);
const cap = []; const onW = r => { if (['POST','PUT','PATCH','DELETE'].includes(r.method()) && r.url().includes('/api/v1/') && !/heartbeat|resolved-batch|presence|\/iam\/auth/.test(r.url())) cap.push(r.method() + ' ' + r.url().replace(API, '') + ' ' + (r.postData() || '').slice(0, 220)); };
page.on('request', onW); const notes = [];
for (const [name, prof] of [['QA MF L-Agent', 'Desk Agent'], ['QA MF L-Admin', 'Desk Administrator']]) {
  const id = L.find(l => l.name === name).id;
  await go(`/settings/modules-and-fields/${OPEN}/layouts/${id}`, 9000);
  await page.getByText(name, { exact: true }).first().locator('xpath=following::button[1]').click(); await sleep(800);
  await page.getByText('Layout Permissions', { exact: true }).click(); await sleep(1800);
  const lab = page.locator('label', { hasText: 'Selected Users' }).last(); await lab.click(); await sleep(1500);
  if (!(await page.getByText(/^Select principals for/).count())) { await lab.locator('div').first().click(); await sleep(1500); }
  const rm = page.locator('select', { hasText: 'Admin' }).last().locator('xpath=following-sibling::*[1]'); if (await rm.count()) { await rm.click({ timeout: 8000 }).catch(() => {}); await sleep(500); }
  // kind dropdown: native select or custom button showing "Users"
  const kindSel = page.locator('select', { hasText: 'Profiles' }); let kind = '';
  if (await kindSel.count()) { await kindSel.first().selectOption({ label: 'Profiles' }); kind = 'select'; }
  else { await page.getByRole('button', { name: /^Users/ }).last().click(); await sleep(600); await page.getByText(/^Profiles?$/).last().click(); kind = 'custom'; }
  await sleep(1500);
  await shot("G10-picker-kind"); const avail = (await page.getByText(prof, { exact: true }).count()); const leftList = (await page.locator("body").innerText()).replace(/s+/g, " "); const li = leftList.indexOf("AVAILABLE"); if (!avail) { rec("G10.debug", "INFO", "kind=" + kind + "; picker text: " + leftList.slice(li, li + 500)); return done(); }
  await page.getByText(prof, { exact: true }).last().click(); await sleep(700);
  const s = await shot(`G10-picker-${prof.replace(/ /g, '-')}`);
  await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(1500);
  await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(2500);
  notes.push(`${name}: kind ${kind}; "${prof}" options=${avail}; message "${((await txt()).replace(/\s+/g, ' ').match(/(saved|Failed[^.]*|Select at least[^.]*)/i) || [''])[0]}"`);
}
page.off('request', onW);
L = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data);
rec('G10.perm', 'INFO', notes.join(' || ') + ` ; layouts: ${L.map(l => l.name + ' assigned=' + JSON.stringify(l.assignedProfiles) + ' access=' + l.accessMode).join(' ; ')}; writes ${cap.join(' || ').slice(0, 800)}`);
return done();
