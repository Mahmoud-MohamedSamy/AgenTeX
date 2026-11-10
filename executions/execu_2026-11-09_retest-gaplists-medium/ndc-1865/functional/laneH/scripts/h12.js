out.loaded=await openTicket();await wt(/QA FT 1865 H comment 2/);await page.waitForTimeout(2000);
await page.locator('button:has-text("Reply All")').first().click();await wt(/Write your reply|wrote:/);await page.waitForTimeout(3000);
const ri=page.locator('input[placeholder="Add a recipient"]').first();
if(await ri.count()){await ri.click();await ri.type('mmohamed@anyware.software');await page.keyboard.press('Enter');await page.waitForTimeout(1000);}
// remove the Cc chip so it isn't duplicated
const ccx=page.locator('button[aria-label*="Remove mmohamed" i]');out.ccx=await ccx.count();
const send=page.locator('button:text-is("Send")').first();await send.scrollIntoViewIfNeeded();
const btns=await page.locator('button').evaluateAll(bs=>bs.map(b=>({t:b.innerText.trim().slice(0,20),a:b.getAttribute('aria-label'),r:b.getBoundingClientRect().toJSON()})).filter(x=>x.r.y>780&&x.r.x>1200));out.btns=btns.map(b=>b.t+'|'+b.a+'|'+Math.round(b.r.x)+','+Math.round(b.r.y));
const arrow=btns.find(b=>!b.t&&b.r.x>1300&&b.r.x<1345);if(arrow){await page.mouse.click(arrow.r.x+arrow.r.width/2,arrow.r.y+arrow.r.height/2);}
await page.waitForTimeout(2000);
out.menu=(await page.locator('[role=menu], [role=menuitem], [role=listbox]').allInnerTexts()).slice(0,10);await shot('s1-send-menu');
return Object.assign(out,{calls:[...new Set(calls)]});
