// Owner: Field Permissions for Desk Agent — QA MF secret = Don't Show, QA MF ro = Read Only; plus H4 (required + Don't Show).
const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
const cap = []; const onW = r => { if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(r.method()) && /permission/.test(r.url())) cap.push(`${r.method()} ${r.url().replace(API, '')} ${(r.postData() || '').slice(0, 300)}`); };
page.on('request', onW);
await go(`/settings/modules-and-fields/${OPEN}`, 6000);
await page.getByRole('tab', { name: 'Fields' }).first().click(); await sleep(2000);
await page.getByText('Field Permissions', { exact: true }).first().click(); await sleep(3000);
await page.locator('select').filter({ hasText: 'Desk Administrator' }).first().selectOption({ label: 'Desk Agent' }); await sleep(2500);
await page.locator('[aria-label="Don\'t Show for QA MF secret"]').first().click(); await sleep(300);
await page.locator('[aria-label="Read Only for QA MF ro"]').first().click(); await sleep(300);
// H4: Name is required — try Don't Show on it
const nameDS = page.locator('[aria-label="Don\'t Show for Name"]').first(); const dis = await nameDS.isDisabled().catch(() => null);
if (!dis) { await nameDS.click().catch(() => { }); await sleep(300); }
await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(3500);
const t = (await txt()).replace(/\s+/g, ' '); const msg = (t.match(/[^.]{0,60}(required|mandatory)[^.]{0,100}/i) || [''])[0];
page.off('request', onW);
const eff = await api('GET', `/modules/${OPEN}/field-permissions`);
const s = await shot('S3-field-permissions-agent');
rec('S3', 'INFO', `writes: ${cap.join(' || ').slice(0, 900)}; field-permissions now: ${eff.t.slice(0, 600)}`, { shot: s });
rec('H4', /name/.test(JSON.stringify(eff.j || '')) && /hidden|dont_show|don't/i.test(JSON.stringify((arr(eff.j && eff.j.data).find(x => /name/.test(JSON.stringify(x))) || {}))) ? 'FAIL' : 'PASS', `required Name field: "Don't Show" radio disabled for Desk Agent=${dis}; after Save message="${msg}"; stored permission for Name: ${JSON.stringify(arr(eff.j && eff.j.data).filter(x => JSON.stringify(x).includes('"name"'))).slice(0, 200)}`);
return done();
