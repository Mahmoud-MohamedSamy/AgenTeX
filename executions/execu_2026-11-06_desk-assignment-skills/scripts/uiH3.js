const o={};const S='../screenshots/';
await page.setViewportSize({width:1600,height:1000});
const reqs=[];page.on('request',r=>{if(r.url().includes('/audit/events?'))reqs.push(r.url().replace(/^.*\/api\/v1/,''));});
await page.goto(H+'/settings/security/audit-log',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForTimeout(8000);
await page.getByText('Any time',{exact:true}).first().click();await page.waitForTimeout(800);
await page.getByText('Custom range',{exact:true}).first().click();await page.waitForTimeout(1500);
const ins=page.locator('input:visible');o.inputs=[];for(let i=0;i<await ins.count();i++){const x=ins.nth(i);o.inputs.push([await x.getAttribute('type'),await x.getAttribute('placeholder'),await x.getAttribute('aria-label'),await x.getAttribute('name')].join('|'));}
await page.screenshot({path:S+'ui-J03-custom.png'});
const d=page.locator('input[type=date]:visible');o.nDate=await d.count();
if(o.nDate>=2){await d.nth(0).fill('2026-11-04');await d.nth(1).fill('2026-11-04');await page.waitForTimeout(500);
  const ap=page.getByRole('button',{name:/apply/i});if(await ap.count())await ap.first().click();await page.waitForTimeout(6000);}
o.reqs=reqs.slice(-3);
const t=await page.innerText('body');const i=t.indexOf('conversion');o.found=i>=0;o.snip=t.slice(Math.max(0,t.indexOf('RECENT ACTIVITY')),Math.max(0,t.indexOf('RECENT ACTIVITY'))+1500);
await page.screenshot({path:S+'ui-J03-nov4.png'});
return o;
