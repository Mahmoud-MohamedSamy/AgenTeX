const K=process.env.K;const reqs=[];page.on('request',r=>{const u=r.url();if(/\/api\/v1\/desk\/tickets\/[0-9a-f-]{36}($|\?)/.test(u))reqs.push(r.method()+' '+u.replace(/^.*\/api\/v1/,''));});
await page.goto(H+'/views/all/tickets',{waitUntil:'domcontentloaded'});await sleep(12000);
await shot('BUG-d2-0-list.png');
const inp=page.locator('input[type="search"], input[placeholder*="earch"]');log('inputs '+await inp.count());
for(let i=0;i<await inp.count();i++)log('ph '+await inp.nth(i).getAttribute('placeholder'));
return {reqs,txt:(await text()).slice(0,1500)};
