await page.setViewportSize({width:1280,height:900});
await page.goto(H+'/settings/integrations/crm',{waitUntil:'commit',timeout:120000});await wt(/Parked/);
await page.getByText('Configuration Details',{exact:true}).first().click();await wt(/Preferences/);await page.waitForTimeout(2500);
const btn=page.locator('button',{hasText:'Never delete the corresponding CRM contact'}).first();await btn.scrollIntoViewIfNeeded();
out.btnCount=await page.locator('button',{hasText:'Never delete the corresponding CRM contact'}).count();
await btn.click();await page.waitForTimeout(1500);
const opts=page.locator('[role=option]');out.optCount=await opts.count();out.opts=[];
for(let i=0;i<out.optCount;i++){const o=opts.nth(i);out.opts.push((await o.innerText()).slice(0,60)+' vis='+(await o.isVisible()));}
await shot('p5-dropdown-open');
const target=page.locator('[role=option]:visible').filter({hasText:'Delete the corresponding CRM contact'}).first();
out.targetCount=await page.locator('[role=option]:visible').filter({hasText:'Delete the corresponding CRM contact'}).count();
// do NOT click yet; just report
await page.keyboard.press('Escape');return out;
