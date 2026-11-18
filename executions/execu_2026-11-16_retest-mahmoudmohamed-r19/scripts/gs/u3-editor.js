await page.goto(H+'/settings/modules-and-fields',{waitUntil:'domcontentloaded'});
for(let i=0;i<30;i++){ await sleep(2000); if(/Global Sets/.test(await text())) break; }
await page.getByRole('tab',{name:/global sets/i}).first().click().catch(async()=>{await page.getByText(/^Global Sets$/).first().click();});
for(let i=0;i<20;i++){ await sleep(1500); if(/QA RT19 GS Tier/.test(await text())) break; }
const row=page.locator('tr:has-text("QA RT19 GS Tier")').first();
await row.locator('button:has-text("fields")').first().click();
for(let i=0;i<20;i++){ await sleep(1500); if(!/Loading…/.test(await text())) break; }
await sleep(1500); log('usedin',(await text()).split('Used In').pop().slice(0,2500)); await shot('2870-2-usedin.png');
await page.keyboard.press('Escape'); await sleep(1500);
await row.locator('button:has-text("QA RT19 GS Tier")').first().click(); await sleep(5000);
await page.getByRole('button',{name:'Where is this value used'}).first().click();
for(let i=0;i<15;i++){ await sleep(1500); if(!/Loading…/.test(await text())) break; } await sleep(1000);
log('valueUsage',(await text()).slice(-2500)); await shot('2870-4-value-usage.png');
await page.keyboard.press('Escape'); await sleep(1500);
if(!/Edit Global Set/.test(await text())) { await row.locator('button:has-text("QA RT19 GS Tier")').first().click(); await sleep(4000); }
await page.getByRole('button',{name:'REPLACED VALUES HISTORY'}).click(); await sleep(4000);
const dlg=page.locator('[role=dialog]').last(); await dlg.evaluate(e=>{const s=[...e.querySelectorAll('*')].find(x=>x.scrollHeight>x.clientHeight+20&&getComputedStyle(x).overflowY!='visible'); if(s) s.scrollTop=s.scrollHeight;}).catch(()=>{}); await sleep(1500);
log('history',(await text()).slice(-2000)); await shot('2870-5-history-unused.png');
await page.getByRole('button',{name:'Add Predefined Choices'}).click(); await sleep(2000); log('predef',(await text()).slice(-800)); await shot('2870-6-predefined.png');
return {};
