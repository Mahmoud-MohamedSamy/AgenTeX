
// owner: set QA MF Open record visibility to "Public Read/Write/Delete", access selected-empty
const cap = []; const onW = r => { if (['POST','PUT','PATCH','DELETE'].includes(r.method()) && r.url().includes('/api/v1/') && !/heartbeat|resolved-batch|presence|/iam/auth/.test(r.url())) cap.push(r.method() + ' ' + r.url().replace(API, '') + ' ' + (r.postData() || '').slice(0, 300)); };
page.on('request', onW);
const dn = { s: "-" };
await go('/settings/modules-and-fields', 6000);
const row = page.locator('tr', { hasText: 'QA MF Open' }).first(); await row.hover(); await sleep(300);
await page.locator('button[aria-label="Open menu for QA MF Open1"]').first().click(); await sleep(700);
await page.locator('button,[role=menuitem]', { hasText: /^Access Control$/ }).last().click(); await sleep(1800);
const dlg = page;
await page.locator('select').filter({ hasText: 'Public Read Only' }).first().selectOption({ label: "Public Read/Write/Delete" }); await sleep(400);
let msg = '';
await dlg.getByText('Selected Users', { exact: true }).click(); await sleep(800); await page.getByRole('button', { name: /^Save$/ }).last().click(); await sleep(1500); msg = (await txt()).replace(/\s+/g, ' ').match(/Select at least one[^.]*/) || ''; msg = msg[0] || ''; await shot('H9-empty-selection'); await page.keyboard.press('Escape');



page.off('request', onW);
const m = (await api('GET', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c')).j.data;
rec('VIS.h9', 'INFO', 'unhide Name for agent → ' + dn.s + '; module recordVisibility now ' + m.recordVisibility + '; message "' + msg + '"; writes: ' + cap.join(' || ').slice(0, 700));
return done();