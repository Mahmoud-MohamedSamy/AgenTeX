const errs=[]; page.on('console',m=>{ if(m.type()==='error') errs.push(m.text().slice(0,300)); }); page.on('pageerror',e=>errs.push('PAGEERROR '+String(e).slice(0,300)));
await page.goto(H+'/settings/modules-and-fields',{waitUntil:'domcontentloaded'});
for(let i=0;i<30;i++){ await sleep(2000); if(/Global Sets/.test(await text())) break; }
await page.getByRole('tab',{name:/global sets/i}).first().click().catch(async()=>{await page.getByText(/^Global Sets$/).first().click();});
for(let i=0;i<20;i++){ await sleep(1500); if(/QA RT19 GS Tier/.test(await text())) break; }
await page.locator('tr:has-text("QA RT19 GS Tier") button:has-text("QA RT19 GS Tier")').first().click(); await sleep(5000);
const dlg=page.locator('[role=dialog]').last();
await shot('2870-7a-unused-copper.png');
// view usage of Copper (second 'Where is this value used' in unused section = last)
await dlg.getByRole('button',{name:'Where is this value used'}).last().click(); await sleep(5000); log('copperUsage',(await text()).slice(-500)); await shot('2870-7b-copper-usage.png');
await page.keyboard.press('Escape'); await sleep(1500);
if(/Something went wrong/.test(await text())) log('CRASH on usage view');
else { await page.locator('[role=dialog]').last().getByRole('button',{name:/Delete "Copper" for good/}).click(); await sleep(6000); log('afterDeleteClick',(await text()).slice(-400)); await shot('2870-7-delete-copper.png'); }
log('errs',errs.slice(0,6));
return {};
