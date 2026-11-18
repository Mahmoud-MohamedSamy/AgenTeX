const Q=process.env.Q||'QA RT19 NTF 2851 mass';const MODE=process.env.MODE||'close';
const net=[];page.on('request',r=>{if(/\/api\/v1\/desk\/tickets/.test(r.url())&&r.method()!=='GET')net.push(r.method()+' '+r.url().replace(/^.*\/api\/v1/,'')+' '+(r.postData()||'').slice(0,200));});
await page.goto(H + '/views/all/tickets', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 60; i++) { await sleep(2000); if (await page.getByRole('button',{name:'Search in this view'}).count()) break; }
await sleep(2000);
if(!/Table View/.test(await text())){await page.getByRole('button',{name:/Classic View|Compact View/}).click();await sleep(1000);await page.getByText('Table View',{exact:true}).first().click();await sleep(3000);}
await page.getByRole('button',{name:'Search in this view'}).click();await sleep(1000);
await page.keyboard.type(Q);await page.keyboard.press('Enter');await sleep(6000);
const rows=page.locator('tr',{hasText:Q});const n=await rows.count();
for(let i=0;i<n;i++)await rows.nth(i).locator('input[type=checkbox]').check({force:true});
await sleep(1500);await shot('2851-2-'+MODE+'-selected.png');
const bar=(await text()).replace(/\s+/g,' ').match(/\d+ selected.{0,300}/)?.[0];
let confirm=null;
if(MODE==='close'){await page.getByRole('button',{name:/^Close$/}).first().click();await sleep(1500);confirm=(await text()).replace(/\s+/g,' ').match(/Close \d+ tickets?.{0,200}/)?.[0];await shot('2851-3-close-confirm.png');await page.getByRole('button',{name:/^Close \d+ tickets?$/}).click();}
await sleep(8000);await shot('2851-4-'+MODE+'-after.png');
return {n,bar,confirm,net};
