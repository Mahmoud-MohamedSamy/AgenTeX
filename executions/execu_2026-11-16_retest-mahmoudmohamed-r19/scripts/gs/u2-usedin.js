await page.goto(H+'/settings/modules-and-fields',{waitUntil:'domcontentloaded'});
for(let i=0;i<30;i++){ await sleep(2000); if(/Global Sets/.test(await text())) break; }
await page.getByRole('tab',{name:/global sets/i}).first().click().catch(async()=>{await page.getByText(/^Global Sets$/).first().click();});
for(let i=0;i<20;i++){ await sleep(1500); if(/QA RT19 GS Tier/.test(await text())) break; }
const row=page.locator('tr:has-text("QA RT19 GS Tier")').first();
await row.locator('button:has-text("fields")').first().click(); await sleep(5000);
log('usedin text',(await text()).split('LAST MODIFIED').pop().slice(0,3000));
await shot('2870-2-usedin.png');
await page.keyboard.press('Escape'); await sleep(1500);
await row.locator('button:has-text("QA RT19 GS Tier")').first().click(); await sleep(5000);
log('editor text',(await text()).slice(-4000));
await shot('2870-3-editor.png');
log('buttons',await page.$$eval('[role=dialog] button',bs=>bs.map(b=>(b.innerText.trim()||b.getAttribute('aria-label')||b.title||'').slice(0,40))));
return {};
