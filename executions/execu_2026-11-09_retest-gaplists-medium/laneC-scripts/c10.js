const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2635/evidence/raw/';
const out={blocked:[]};
await page.route('**/api/v1/**',r=>{const m=r.request().method();const u=r.request().url();if(m!=='GET'&&!/query|search|lookup|summaries|resolved-batch|heartbeat|realtime/i.test(u)){out.blocked.push(m+' '+u.replace(/.*api\/v1/,'').slice(0,70));return r.abort();}return r.continue();});
page.on('response',r=>{if(r.status()===403)out.f403=(out.f403||[]).concat(r.request().method()+' '+r.url().replace(/.*api\/v1/,'').slice(0,70));});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/modules/d120a6c2-2596-4254-968b-a1bcd3a000bf',{waitUntil:'load',timeout:120000});await page.waitForTimeout(8000);
const cb=page.locator('input[type=checkbox],[role=checkbox]');await cb.nth(1).click({force:true});await page.waitForTimeout(1500);
await page.getByRole('button',{name:/^More$/}).first().click().catch(async()=>{await page.getByText('More',{exact:true}).first().click()});await page.waitForTimeout(1500);
out.more=await page.locator('[role=menuitem]').allInnerTexts();
await page.screenshot({path:D+'tavi-bulk-more.png'});
// row icons
out.rowIcons=await page.locator('main [aria-label]').evaluateAll(es=>[...new Set(es.map(e=>e.getAttribute('aria-label')).filter(a=>/delete|trash|open/i.test(a)))].slice(0,10));
return out;
