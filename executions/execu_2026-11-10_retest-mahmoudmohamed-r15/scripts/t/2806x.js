await page.goto(H + '/settings/modules-and-fields/841043e1-c078-41f9-8d6e-dfd61bee45c3/layouts/bf971461-2edc-45f2-b6e4-6e180aa64288', { waitUntil: 'domcontentloaded' });
for (let i=0;i<30;i++){ await sleep(2000); if (/Lead Source/.test(await text())) break; }
const ls = page.getByText('Lead Source', {exact:true}).first(); await ls.hover(); await sleep(800);
await ls.locator('xpath=ancestor::*[.//button][1]').getByRole('button', {name:'Field options'}).click(); await sleep(1500);
await page.getByText('Edit Properties', {exact:true}).click(); await sleep(3000);
for (const tab of ['VALIDATION','ADVANCED']) { await page.getByText(tab, {exact:true}).last().click(); await sleep(2000); const t = await page.locator('aside, [role=dialog]').last().innerText().catch(()=>''); log(tab, t.slice(0,1500)); await shot('2806-ls-'+tab+'.png'); }
