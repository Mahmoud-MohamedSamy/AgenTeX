await page.goto(H + '/views/all/tickets', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); if (await page.getByRole('button',{name:'Search in this view'}).count()) break; }
await sleep(2000);
await page.getByRole('button',{name:'Classic View'}).click();await sleep(1500);
const menu=(await text()).match(/Classic View[\s\S]{0,200}/)?.[0];
await page.getByText('Table View',{exact:false}).first().click().catch(()=>{});await sleep(3000);
await page.getByRole('button',{name:'Search in this view'}).click();await sleep(1000);
await page.keyboard.type('QA RT19 NTF 2851 mass');await page.keyboard.press('Enter');await sleep(6000);
const cbs=await page.locator('input[type=checkbox]').count();
await shot('2851-1-search.png');
const t=(await text()).replace(/\s+/g,' ');const i=t.indexOf('2851 mass');
return {menu,cbs,around:t.slice(Math.max(0,i-600),i+400)};
