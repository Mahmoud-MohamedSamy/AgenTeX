await page.goto(H + '/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3/layouts/bf971461-2edc-45f2-b6e4-6e180aa64288', { waitUntil: 'domcontentloaded' });
for (let i=0;i<30;i++){ await sleep(2000); if (/Lead Source/.test(await text())) break; }
const ls = page.getByText('Lead Source', {exact:true}).first(); await ls.hover(); await sleep(800);
await ls.locator('xpath=ancestor::*[.//button][1]').getByRole('button', {name:'Field options'}).click(); await sleep(1500);
await page.getByText('Edit Properties', {exact:true}).click(); await sleep(2500);
await page.getByText('ADVANCED', {exact:true}).last().click(); await sleep(1500);
await page.getByRole('button', {name:'Associate with global set'}).click(); await sleep(3000);
let d = page.locator('[role=dialog]').last(); log('dlg1', (await d.innerText()).slice(0,1200)); await shot('2806-assoc-1.png');
const sel = d.locator('select').first(); if (await sel.count()) { log('opts', await sel.evaluate(s=>[...s.options].map(o=>o.text))); await sel.selectOption({label:'QA RT15 GS Regions'}).catch(e=>log('selErr',String(e).slice(0,80))); await sleep(3000); }
else { const cb = d.getByRole('combobox').first(); if (await cb.count()) { await cb.click(); await sleep(1000); await page.getByText('QA RT15 GS Regions').last().click(); await sleep(3000);} }
d = page.locator('[role=dialog]').last(); log('dlg2', (await d.innerText()).slice(0,2000)); await shot('2806-assoc-2.png');
const vap = page.getByText(/View associated places/i).first(); log('vap', await vap.count()); if (await vap.count()) { await vap.click(); await sleep(2500); log('vap-open', (await page.locator('[role=dialog]').last().innerText()).slice(0,1000)); await shot('2806-assoc-3.png'); }
