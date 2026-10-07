const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
const pr = await api('GET', '/iam/profiles?page_size=100'); const plist = arr(pr.j && pr.j.data).map(p => `${p.name}${p.appKey || p.app_key ? '(' + (p.appKey || p.app_key) + ')' : ''}`);
const shotP = await shot('G10-profiles-kind');
let L = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data);
const cap = []; const onW = r => { if (['POST','PUT','PATCH','DELETE'].includes(r.method()) && r.url().includes('/api/v1/') && !/heartbeat|resolved-batch|presence|\/iam\/auth/.test(r.url())) cap.push(r.method() + ' ' + r.url().replace(API, '') + ' ' + (r.postData() || '').slice(0, 220)); };
page.on('request', onW); const notes = [];
for (const [name, who] of [['QA MF L-Agent', 'mahmoud.mohamed1@taviportal.com'], ['QA MF L-Admin', null]]) {
  const id = L.find(l => l.name === name).id;
  await go(`/settings/modules-and-fields/${OPEN}/layouts/${id}`, 9000);
  await page.getByText(name, { exact: true }).first().locator('xpath=following::button[1]').click(); await sleep(800);
  await page.getByText('Layout Permissions', { exact: true }).click(); await sleep(1800);
  const lab = page.locator('label', { hasText: 'Selected Users' }).last(); await lab.click(); await sleep(1500);
  if (!(await page.getByText(/^Select principals for/).count())) { await lab.locator('div').first().click(); await sleep(1500); }
  if (who) {
    const rm = page.locator('select', { hasText: 'Admin' }).last().locator('xpath=following-sibling::*[1]'); if (await rm.count()) { await rm.click({ timeout: 8000 }).catch(() => {}); await sleep(500); }
    const srch = page.getByPlaceholder('Search').last(); await srch.fill('mahmoud'); await sleep(1500);
    const hit = page.getByText(who, { exact: true }); if (!(await hit.count())) { const b = (await page.locator("body").innerText()).replace(/s+/g, " "); const i = b.indexOf("AVAILABLE"); await shot("G10-search-debug"); rec("G10.debug", "INFO", b.slice(i, i + 400)); return done(); } await hit.last().click(); await sleep(700);
  }
  await shot(`G10-picker-${name.replace(/ /g, '-')}`);
  await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(1500);
  await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(2500);
}
page.off('request', onW);
L = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data);
rec('G10.profiles', 'INFO', `tenant profiles: ${plist.join(', ')}`, { shot: shotP });
rec('G10.perm', 'INFO', `layouts: ${L.map(l => l.name + ' ' + l.id + ' assigned=' + JSON.stringify(l.assignedProfiles) + ' access=' + l.accessMode).join(' ; ')}; writes ${cap.join(' || ').slice(0, 800)}`);
return done();
