const res=[]; page.on('response',async r=>{ if(r.url().includes('/channels/domains') ){ res.push(r.request().method()+' '+r.url().split('/api/v1')[1]+' '+r.status()+' '+(r.request().postData()||'')+' → '+(await r.text().catch(()=>'')).slice(0,200)); }});
await page.goto(H+'/settings/channels/email',{waitUntil:'domcontentloaded'}); await sleep(10000);
await page.getByRole('tab',{name:/Your domains/}).click(); await sleep(3000);
const card=page.locator('main').getByText('x.com',{exact:true}).first();
await card.scrollIntoViewIfNeeded(); await shot('3002-5-xcom-listed.png');
// open the row menu next to x.com
const row=page.locator('main section, main div').filter({has:page.getByText('x.com',{exact:true})}).last();
const menus=await row.locator('button').allInnerTexts();
await row.locator('button').last().click(); await sleep(1500);
const items=await page.locator('[role=menuitem]').allInnerTexts();
return {menus,items,res};
