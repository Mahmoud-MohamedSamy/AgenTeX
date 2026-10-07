// Writes owner/agent step scripts for the record-visibility and access-control checks.
const fs = require('fs'); const D = __dirname;
const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
const ownerSet = (name, visLabel, access) => `
// owner: set QA MF Open record visibility to "${visLabel}"${access ? ', access ' + access : ''}
const cap = []; const onW = r => { if (['POST','PUT','PATCH','DELETE'].includes(r.method()) && r.url().includes('/api/v1/') && !/heartbeat|resolved-batch|presence|/iam/auth/.test(r.url())) cap.push(r.method() + ' ' + r.url().replace(API, '') + ' ' + (r.postData() || '').slice(0, 300)); };
page.on('request', onW);
${name === 'vis-ro' ? `const fp = arr((await api('GET', '/modules/${OPEN}/field-permissions')).j.data).find(x => x.fieldName === 'name' && x.profileId === '44444444-4444-4444-4444-444444444402'); const dn = fp ? await api('DELETE', '/modules/${OPEN}/field-permissions/' + fp.id) : { s: '-' };` : 'const dn = { s: "-" };'}
await go('/settings/modules-and-fields', 6000);
const row = page.locator('tr', { hasText: 'QA MF Open' }).first(); await row.hover(); await sleep(300);
await page.locator('button[aria-label="Open menu for QA MF Open1"]').first().click(); await sleep(700);
await page.locator('button,[role=menuitem]', { hasText: /^Access Control$/ }).last().click(); await sleep(1800);
const dlg = page;
await page.locator('select').filter({ hasText: 'Public Read Only' }).first().selectOption({ label: ${JSON.stringify(visLabel)} }); await sleep(400);
let msg = '';
${access === 'selected-empty' ? `await dlg.getByText('Selected Users', { exact: true }).click(); await sleep(800); await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(1500); msg = (await txt()).replace(/\\s+/g, ' ').match(/Select at least one[^.]*/) || ''; msg = msg[0] || ''; await shot('H9-empty-selection'); await page.keyboard.press('Escape');` : ''}
${access === 'selected-owner' ? `await dlg.getByText('Selected Users', { exact: true }).click(); await sleep(1200); const s0 = await shot('A8-picker'); const picker = page.locator('[role=dialog]').last(); const inp = picker.locator('input[type=text], input[type=search], input:not([type])').first(); if (await inp.count()) { await inp.fill('ndc-staging'); await sleep(1200); } const opt = page.getByText(/ndc-staging-owner/).last(); if (await opt.count()) { await opt.click(); await sleep(500); } const add = page.locator('button', { hasText: /^(Add|Done|Apply|Select|Confirm)/ }).last(); if (await add.count()) { await add.click().catch(() => {}); await sleep(800); } await page.locator('[role=dialog] button', { hasText: /^Save$/ }).last().click().catch(() => {}); await sleep(2000); msg = (await txt()).replace(/\\s+/g, ' ').match(/Access settings saved\\.|Failed to save[^.]*\\./) || ''; msg = msg[0] || '';` : ''}
${access === 'all' ? `await dlg.getByText('All Users', { exact: true }).click(); await sleep(400);` : ''}
${access === 'selected-empty' || access === 'selected-owner' ? '' : `await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(2500);`}
page.off('request', onW);
const m = (await api('GET', '/modules/${OPEN}')).j.data;
rec('VIS.${name}', 'INFO', 'unhide Name for agent → ' + dn.s + '; module recordVisibility now ' + m.recordVisibility + '; message "' + msg + '"; writes: ' + cap.join(' || ').slice(0, 700));
return done();`;
fs.writeFileSync(D + '/o-vis-public.js', ownerSet('vis-public', 'Public Read/Write/Delete', 'all'));
fs.writeFileSync(D + '/o-vis-ro.js', ownerSet('vis-ro', 'Public Read Only', null));
fs.writeFileSync(D + '/o-vis-private.js', ownerSet('vis-private', 'Private', null));
fs.writeFileSync(D + '/o-h9.js', ownerSet('h9', 'Public Read/Write/Delete', 'selected-empty'));
fs.writeFileSync(D + '/o-a8.js', ownerSet('a8', 'Public Read/Write/Delete', 'selected-owner'));
// agent checks
const agent = (id, title) => `
// agent: ${title}
const enc = v => ({ kind: 'string', value: v });
const recs = arr((await api('GET', '/modules/${OPEN}/records?page_size=50')).j.data);
const own = recs.filter(r => /agent/.test(JSON.stringify(r)));
const ownerRecs = recs.filter(r => /owner rec/.test(JSON.stringify(r)));
let mine = own[0] && own[0].id; if (!mine) { const c = await api('POST', '/modules/${OPEN}/records', { data: [{ field: 'name', value: enc('QA MF agent rec ${id}') }] }); mine = c.j && c.j.data && c.j.data.id; }
const allIds = (await api('GET', '/modules/${OPEN}/records?page_size=50')).j; const visible = arr(allIds && allIds.data).length;
const target = ownerRecs[0] && ownerRecs[0].id;
const eo = target ? await api('PATCH', '/modules/${OPEN}/records/' + target, { data: [{ field: 'qa_vis', value: enc('agent edit ${id}') }] }) : { s: '-' };
const em = mine ? await api('PATCH', '/modules/${OPEN}/records/' + mine, { data: [{ field: 'qa_vis', value: enc('agent own edit ${id}') }] }) : { s: '-' };
const go1 = target ? await api('GET', '/modules/${OPEN}/records/' + target) : { s: '-' };
rec('${id}.agent', 'INFO', 'records visible to agent: ' + visible + ' (owner records seen: ' + ownerRecs.length + '); GET an owner record → ' + go1.s + '; PATCH owner record → ' + eo.s + '; PATCH own record → ' + em.s + ' (own record ' + (mine ? 'present' : 'NOT created') + ')', { ownerSeen: ownerRecs.length, eo: eo.s, em: em.s, go1: go1.s, visible });
return done();`;
fs.writeFileSync(D + '/a-vis-public.js', agent('H6', 'Public Read/Write/Delete'));
fs.writeFileSync(D + '/a-vis-ro.js', agent('H7', 'Public Read Only'));
fs.writeFileSync(D + '/a-vis-private.js', agent('H8', 'Private'));
fs.writeFileSync(D + '/a-a8.js', `
const m = arr((await api('GET', '/modules')).j.data).some(x => x.id === '${OPEN}'); const g = await api('GET', '/modules/${OPEN}/records'); await go('/modules/${OPEN}', 7000); const t = await txt(); const s = await shot('A8-agent-after-selected-users');
rec('A8.agent', 'INFO', 'module listed for agent=' + m + '; GET records → ' + g.s + '; records page shows access message=' + /permission|access|not found/i.test(t), { shot: s, listed: m, gs: g.s });
return done();`);
console.log('written');
