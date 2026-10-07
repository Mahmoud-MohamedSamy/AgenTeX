const OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c';
const cap = []; const onW = r => { if (['POST','PUT','PATCH','DELETE'].includes(r.method()) && r.url().includes('/api/v1/') && !/heartbeat|resolved-batch|presence|/iam/auth/.test(r.url())) cap.push(r.method() + ' ' + r.url().replace(API, '') + ' ' + (r.postData() || '').slice(0, 200)); };
page.on('request', onW);
await go(`/settings/modules-and-fields/${OPEN}`, 6000);
await page.getByRole('tab', { name: 'Layouts' }).first().click(); await sleep(1500);
await page.getByRole('button', { name: /Create New Layout/ }).click(); await sleep(3000);
await page.getByRole('button', { name: /^Save$/ }).click(); await sleep(2500);
const d = (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ');
const ins = await page.locator('[role=dialog] input').evaluateAll(es => es.map(e => e.type + ':' + e.placeholder));
const s = await shot('G10-save-new-layout');
let after = '';
if (ins.length) { await page.locator('[role=dialog] input').first().fill('QA MF L-Agent'); await page.locator('[role=dialog]').last().getByRole('button', { name: /^(Save|Create|OK)$/ }).last().click(); await sleep(4000); after = page.url().replace(H, ''); }
page.off('request', onW);
rec('G10.save', 'INFO', `after Save: dialog "${d.slice(0, 300)}"; inputs ${ins.join(',')}; url ${after}; writes ${cap.join(' || ').slice(0, 600)}`, { shot: s });
return done();
