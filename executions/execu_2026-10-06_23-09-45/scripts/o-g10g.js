const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
let L = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data); const ADM = L.find(l => l.name === 'QA MF L-Admin').id, AG = L.find(l => l.name === 'QA MF L-Agent').id;
const cap = [], gets = []; const onW = r => { const u = r.url(); if (!u.includes('/api/v1/') || /heartbeat|resolved-batch|presence|\/iam\/auth/.test(u)) return; if (r.method() === 'GET') gets.push(u.replace(API, '').slice(0, 140)); else cap.push(r.method() + ' ' + u.replace(API, '') + ' ' + (r.postData() || '').slice(0, 260)); };
await go(`/settings/modules-and-fields/${OPEN}/layouts/${ADM}`, 9000);
page.on('request', onW);
await page.getByText('QA MF L-Admin', { exact: true }).first().locator('xpath=following::button[1]').click(); await sleep(800);
await page.getByText('Layout Permissions', { exact: true }).click(); await sleep(1800);
const lab = page.locator('label', { hasText: 'Selected Users' }).last(); await lab.click(); await sleep(2000);
if (!(await page.getByText(/^Select principals for/).count())) { await lab.locator('div').first().click(); await sleep(2000); }
if (!/Users — d/.test(await page.locator('body').innerText())) { await page.getByPlaceholder('Search').last().fill('ndc-staging-owner'); await sleep(1500); await page.getByText('ndc-staging-owner@taviportal.com', { exact: true }).last().click(); await sleep(800); }
await shot('G10-picker-L-Admin');
await page.locator('xpath=//*[starts-with(normalize-space(.),"Select principals for") and not(*)]/ancestor::div[.//button[normalize-space(.)="Save"]][1]').getByRole('button', { name: /^Save$/ }).click(); await sleep(1500);
await page.getByRole('button', { name: /^Save$/, disabled: false }).last().click(); await sleep(3000);
page.off('request', onW);
const acl = cap.find(c => /acl/.test(c)) || ''; const am = cap.find(c => /access-mode/.test(c)) || '';
// mirror for L-Agent with the Desk Agent profile
let ra = { s: '-' }, rm = { s: '-' };
if (acl) { const path = acl.split(' ')[1].replace(ADM, AG); ra = await api('PUT', path, { rows: [{ principal_kind: 'profile', principal_id: '44444444-4444-4444-4444-444444444402', permission_key: null, access_level: 'admin' }] }); }
if (am) { const path = am.split(' ')[1].replace(ADM, AG); rm = await api('PATCH', path, { access_mode: 'selected' }); }
const ga = await api('GET', `/modules/${OPEN}/layouts/${AG}/acl`); const gd = await api('GET', `/modules/${OPEN}/layouts/${ADM}/acl`);
L = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data);
rec('G10.perm', 'INFO', `UI writes for L-Admin: ${cap.join(' || ').slice(0, 500)}; picker source GETs: ${[...new Set(gets)].filter(g => /user|profile|principal|org/.test(g)).join(' , ').slice(0, 400)}; L-Agent mirror: acl → ${ra.s} ${ra.s >= 300 ? (ra.t || '').slice(0, 120) : ''}, access-mode → ${rm.s}; GET acl L-Agent ${ga.s} ${(ga.t || '').slice(0, 200)}; L-Admin ${gd.s} ${(gd.t || '').slice(0, 200)}; layouts: ${L.map(l => l.name + ' access=' + l.accessMode).join(' ; ')}`, { AG, ADM });
return done();
