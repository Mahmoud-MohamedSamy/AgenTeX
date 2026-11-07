const o = {};
await page.goto(H + '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/new', { waitUntil: 'commit', timeout: 120000 });
for (let i = 0; i < 60; i++) { await sleep(3000); if (/Create Ticket/.test(await text())) break; } await sleep(4000);
const row = lbl => page.locator(`xpath=//*[normalize-space(text())="${lbl}"]/ancestor::*[self::div][2]`).first();
const lsel = page.locator('xpath=//*[normalize-space(text())="Create Ticket"]/following::select[1]').first();
const tsel = page.locator('xpath=//*[normalize-space(text())="Create Ticket"]/following::select[2]').first();
const opts = async s => s.evaluate(x => [...x.options].map(y => y.text)).catch(() => 'no select');
const pickDept = async name => { await row('Department').locator('input, [role=combobox], button').first().click(); await sleep(1000); await page.keyboard.type(name); await sleep(2500); await page.getByRole('option', { name, exact: true }).first().click(); await sleep(5000); };
o.cs = await opts(tsel);
await pickDept('QA NDC Accounting'); o.accStandard = { layout: await lsel.evaluate(x => x.selectedOptions[0]?.text), templates: await opts(tsel) };
await lsel.selectOption({ label: 'QA NDC Accounting' }); await sleep(4000); o.accAccounting = await opts(tsel);
await lsel.selectOption({ label: 'QA NDC ADM' }); await sleep(5000); o.accADM = await opts(tsel);
await shot('2803-f-create-adm.png');
if (String(o.accADM).includes('QA RT12 2803')) { await tsel.selectOption({ label: (await tsel.evaluate(x => [...x.options].map(y => y.text))).find(t => /QA RT12 2803/.test(t)) }); await sleep(4000);
  o.afterApply = { template: await tsel.evaluate(x => x.selectedOptions[0]?.text), adm: await row('ADM Number').locator('input').first().inputValue().catch(() => null), adm2: await row('QA NDC ADM Number').locator('input').first().inputValue().catch(() => null), priority: (await row('Priority').innerText().catch(() => '')).replace(/\s+/g, ' ') };
  await shot('2803-g-applied.png'); }
return o;
