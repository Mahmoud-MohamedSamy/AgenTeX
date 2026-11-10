const D='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2635/evidence/raw/';
const out={};
await page.route('**/api/v1/**',r=>{const m=r.request().method();const u=r.request().url();if(m!=='GET'&&!/query|search|lookup|summaries|resolved-batch/i.test(u))return r.abort();return r.continue();});
await page.setViewportSize({width:1440,height:900});
await page.goto(H+'/activities',{waitUntil:'load',timeout:120000});await page.waitForTimeout(8000);
await page.getByRole('link',{name:/^Tasks$/}).first().click().catch(async()=>{await page.getByText('Tasks',{exact:true}).first().click()});await page.waitForTimeout(5000);
out.url=page.url().replace(H,'');
out.layoutBtns=await page.locator('button[aria-label]').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label')).filter(a=>/layout|table|compact|classic/i.test(a)));
const cb=page.locator('input[type=checkbox],[role=checkbox]');out.cb=await cb.count();
if(!out.cb){const t=page.locator('button[aria-label*="Table" i]').first();if(await t.count()){await t.click();await page.waitForTimeout(4000);out.cb=await cb.count();}}
if(out.cb>1){await cb.nth(1).click({force:true});await page.waitForTimeout(2000);}
await page.screenshot({path:D+'tavi-bulk-bar.png'});
out.bulk=(await page.locator('body').innerText()).split('\n').filter(l=>/selected|Update|Delete|Assign|Export|Clear/i.test(l)).slice(0,15);
return out;
