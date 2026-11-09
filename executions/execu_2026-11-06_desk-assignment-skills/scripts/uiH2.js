const o={};const S='../screenshots/';
await page.setViewportSize({width:1600,height:1000});
const reqs=[];page.on('request',r=>{if(r.url().includes('/audit/events'))reqs.push(r.url().replace(/^.*\/api\/v1/,''));});
await page.goto(H+'/settings/security/audit-log?from=2026-11-04T15:50:00Z&to=2026-11-04T15:51:00Z',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForTimeout(9000);
o.reqs1=reqs.slice();
const body1=await page.innerText('body');o.hasConv1=/conversion/i.test(body1);
// try the "Any time" filter
const any=page.getByText('Any time',{exact:true}).first();if(await any.count()){await any.click();await page.waitForTimeout(1500);o.anyMenu=(await page.innerText('body')).match(/Any time[\s\S]{0,400}/)[0].slice(0,400);await page.screenshot({path:S+'ui-J03-anytime-menu.png'});}
return o;
