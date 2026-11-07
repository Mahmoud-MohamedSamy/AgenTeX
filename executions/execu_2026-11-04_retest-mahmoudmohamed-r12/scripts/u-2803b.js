const o = {}; const reqs = [];
page.on('request', r => { if (/ticket-templates/.test(r.url()) && r.method() !== 'GET') reqs.push(r.method() + ' ' + (r.postData() || '').slice(0, 600)); });
page.on('response', async r => { if (/ticket-templates/.test(r.url()) && r.request().method() !== 'GET') reqs.push('→ ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 300)); });
await page.goto(H + '/settings/tickets/templates', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/New template/i.test(await text())) break; } await sleep(3000);
const selects = page.locator('main select');
o.nSelects = await selects.count();
const rows = async () => (await page.locator('main table tbody tr').allInnerTexts()).map(s => s.replace(/\s+/g, ' ').trim());
// 1) department filter
await selects.first().selectOption({ label: 'Customer Support' }); await sleep(3000); o.filterCS = await rows(); await shot('2803-c-filter-cs.png');
await selects.first().selectOption({ label: 'QA NDC Accounting' }); await sleep(3000); o.filterAcc = await rows();
// 2) new template in QA NDC Accounting
await page.getByRole('button', { name: /New template/i }).first().click(); await sleep(4000);
const dlg = page.getByRole('dialog').last(); const dsel = dlg.locator('select');
o.dlgSelects = await dsel.count();
const lab = async i => dsel.nth(i).evaluate(s => ({ value: s.selectedOptions[0]?.text, options: [...s.options].map(x => x.text) }));
o.formDept = (await lab(0)).value; o.formLayouts = await lab(1);
await dlg.getByLabel(/Template name/i).fill('QA RT12 2803 ADM template').catch(async () => { await dlg.locator('input').first().fill('QA RT12 2803 ADM template'); });
// save without layout
await dlg.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(2500); o.noLayoutMsg = (await dlg.innerText().catch(() => '')).match(/[^\n]*(layout|required)[^\n]*/gi)?.slice(0, 4);
await dsel.nth(1).selectOption({ label: 'QA NDC ADM' }); await sleep(3000);
const ft = await dlg.innerText(); o.fieldsShown = (ft.match(/IATA Source|ADM Number|Airline Code|ADM Reason|Amount/g) || []).join(',');
await shot('2803-d-new-adm.png');
const adm = dlg.locator('xpath=.//*[normalize-space(text())="QA NDC ADM Number" or normalize-space(text())="ADM Number"]/following::input[1]').first();
if (await adm.count()) await adm.fill('QA-RT12-2803'); else o.admInput = 'not found';
await dlg.getByRole('button', { name: 'Save', exact: true }).click(); await sleep(5000);
o.afterSave = await rows(); await shot('2803-e-saved.png');
o.reqs = reqs;
return o;
