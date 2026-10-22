globalThis.__mode = 'B';
// Investigation: does a CRM layout builder Save persist? Test A = add a plain Single Line field; Test B = add a Rollup Summary.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', Q = 'f01e6c73-e8c3-4cf9-a109-ff99a2a57b11';
const MODE = globalThis.__mode || 'A';
const reqs = []; const fr = r => { const u = r.url(); if (r.method() !== 'GET' && u.includes('/api/') && !/notif|presence|heartbeat|resolved/.test(u)) reqs.push(r.method() + ' ' + u.replace(API, '').slice(0, 110)); }; page.on('request', fr);
const resps = []; const fs = async r => { const q = r.request(); if (q.method() !== 'GET' && q.url().includes('/api/') && !/notif|presence|heartbeat|resolved/.test(q.url())) resps.push(q.method() + ' ' + q.url().replace(API, '').slice(0, 90) + ' → ' + r.status() + (r.status() >= 300 ? ' ' + (await r.text().catch(() => '')).slice(0, 200) : '')); }; page.on('response', fs);
const errs = []; const fe = m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); }; page.on('console', fe);
await go(`/settings/modules-and-fields/${L}/layouts/${Q}`, 8000);
for (let i = 0; i < 30 && !(await page.locator('main').getByText('Single Line Permission', { exact: true }).count()); i++) await sleep(1500);
const head = (await txt()).match(/Leads\n\|\n[^\n]*/)?.[0];
const unused0 = (await txt()).match(/Unused Fields\n(\d+)/)?.[1];
const palette = page.getByText(MODE === 'A' ? 'Single Line' : /^Rollup Sum/, { exact: MODE === 'A' }).first(); const sb = await palette.boundingBox();
const tgt = page.locator('main').getByText('Phone Permission', { exact: true }).first(); await tgt.scrollIntoViewIfNeeded(); const tb = await tgt.boundingBox();
await page.mouse.move(sb.x + 20, sb.y + 8); await page.mouse.down(); await sleep(200);
for (let i = 1; i <= 25; i++) { await page.mouse.move(sb.x + 20 + (tb.x + 30 - sb.x - 20) * i / 25, sb.y + 8 + (tb.y + 10 - sb.y - 8) * i / 25); await sleep(40); }
await sleep(300); await page.mouse.up(); await sleep(2500);
const panelOpen = (await txt()).includes('Field Properties');
if (MODE === 'B' && panelOpen) {
  const sels = page.locator('select'); const find = async re => { const n = await sels.count(); for (let i = n - 1; i >= 0; i--) { const t = await sels.nth(i).evaluate(s => [...s.options].map(o => o.text).join('|')); if (re.test(t)) return sels.nth(i); } return null; };
  await (await find(/Select the related module/)).selectOption({ label: 'Deals' }); await sleep(1200);
  await (await find(/Select the relation/)).selectOption({ label: 'Connected To' }); await sleep(1200);
  const fa = await find(/None — count records only/); if (fa) await fa.selectOption({ label: 'Amount' }); await sleep(1000);
}
if (panelOpen) { await page.getByText('GENERAL', { exact: true }).last().click(); await sleep(600); await page.getByPlaceholder('Label in English').fill(MODE === 'A' ? 'QA RT plain' : 'QA RT rollup2'); await page.getByRole('button', { name: 'Apply', exact: true }).last().click(); await sleep(1500); }
await shot(`inv-layout-${MODE}-before-save`);
reqs.length = 0; resps.length = 0;
await page.getByRole('button', { name: 'Save', exact: true }).click();
for (let i = 0; i < 20; i++) { await sleep(1500); if (!/Saving/.test(await page.locator('body').innerText())) break; }
await sleep(2000);
await shot(`inv-layout-${MODE}-after-save`);
const toasts = await page.locator('[data-sonner-toast]').allInnerTexts();
page.off('request', fr); page.off('response', fs); page.off('console', fe);
const lay = (await api('GET', `/modules/${L}/layouts`)).j.data.find(l => l.id === Q);
const label = MODE === 'A' ? 'QA RT plain' : 'QA RT rollup2';
return done({ MODE, head, unused0, panelOpen, reqs, resps, errs: errs.slice(0, 6), toasts, inLayout: JSON.stringify(lay.views).includes(label), lastModifiedAt: lay.lastModifiedAt });
