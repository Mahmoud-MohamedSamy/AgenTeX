await page.goto(H+'/activities',{waitUntil:'load',timeout:120000});await wt(/All Activities \(\d+\)/);await page.waitForTimeout(3000);
await page.locator('button:near(:text("All Activities"))').nth(1).click({timeout:10000}).catch(e=>out.searchBtnErr=String(e).slice(0,80));await page.waitForTimeout(1000);
const si=page.locator('input[placeholder*="earch" i]').first();await si.fill('QA FT 1865 H');await page.keyboard.press('Enter');await page.waitForTimeout(6000);
out.list=await lines(/QA FT 1865 H|Activities \(|Completed|Scheduled|Not Started/);await shot('a3-activities-list');
return Object.assign(out,{calls:[...new Set(calls)]});
