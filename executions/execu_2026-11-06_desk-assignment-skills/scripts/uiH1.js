const o={};const S='../screenshots/';
await page.setViewportSize({width:1600,height:900});
await page.goto(H+'/settings/security/audit-log',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForTimeout(9000);
o.url=page.url();
const inp=page.locator('input[type=search], input[placeholder*="earch" i]').first();o.hasSearch=await inp.count();
if(o.hasSearch){await inp.fill('QA NDC RR manual invoice 1');await page.keyboard.press('Enter');await page.waitForTimeout(5000);}
await page.screenshot({path:S+'ui-J03-audit-search.png'});
o.text=(await page.innerText('#main-content').catch(async()=>await page.innerText('body'))).slice(0,2500);
return o;
