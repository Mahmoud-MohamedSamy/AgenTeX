out.loaded=await openTicket();await wt(/QA FT 1865 H comment 2/);await page.waitForTimeout(2000);
await page.locator('button:has-text("Reply All")').first().click();await wt(/Write your reply|wrote:/);await page.waitForTimeout(3000);
const ri=page.locator('input[placeholder="Add a recipient"]').first();
if(await ri.count()){await ri.click();await ri.type('mmohamed@anyware.software');await page.keyboard.press('Enter');await page.waitForTimeout(1000);}
const ccx=page.locator('button[aria-label*="Remove mmohamed" i]');if(await ccx.count()>1){await ccx.nth(1).click();await page.waitForTimeout(800);}
const t=await body();out.recips=t.slice(t.indexOf('Recipients'),t.indexOf('Subject')).replace(/\n/g,' | ');
await page.locator('button[aria-label="More send options"]').click();await page.waitForTimeout(1000);
await page.locator('[role=menuitem]:text-is("Schedule")').click();await page.waitForTimeout(2500);
out.dialog=(await page.locator('[role=dialog]').allInnerTexts()).map(x=>x.slice(0,500));await shot('s2-schedule-dialog');
out.inputs=await page.locator('[role=dialog] input, [role=dialog] select, [role=dialog] button').evaluateAll(es=>es.map(e=>e.tagName+':'+(e.type||'')+':'+(e.innerText||e.value||e.getAttribute('aria-label')||'').slice(0,30)));
return Object.assign(out,{calls:[...new Set(calls)]});
