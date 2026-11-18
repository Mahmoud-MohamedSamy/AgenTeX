await page.goto(H+'/settings/modules-and-fields',{waitUntil:'domcontentloaded'});
for(let i=0;i<30;i++){ await sleep(2000); if(/Global Sets/.test(await text())) break; }
await page.getByRole('tab',{name:/global sets/i}).first().click().catch(async()=>{await page.getByText(/^Global Sets$/).first().click();});
for(let i=0;i<20;i++){ await sleep(1500); if(/QA RT19 GS Tier/.test(await text())) break; }
await page.getByRole('button',{name:/new global set/i}).first().click(); await sleep(3000);
const dlg=page.locator('[role=dialog]').last();
await dlg.getByRole('button',{name:'Add Predefined Choices'}).click(); await sleep(1500);
await page.getByText('Months',{exact:true}).last().click(); await sleep(2000);
const t1=await dlg.innerText(); log('afterMonths',t1.slice(0,1500));
await shot('2870-6-predefined-months.png');
await dlg.getByRole('button',{name:'Add Predefined Choices'}).click(); await sleep(1500);
await page.getByText('Months',{exact:true}).last().click(); await sleep(2000);
log('again',(await page.innerText('body')).match(/[^\n]*(added|skipped|already)[^\n]*/gi));
await dlg.getByRole('button',{name:'Cancel'}).click(); await sleep(1500);
return {};
