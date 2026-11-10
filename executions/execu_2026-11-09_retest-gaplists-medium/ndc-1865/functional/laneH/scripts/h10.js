out.loaded=await openTicket();await wt(/QA FT 1865 H reply 1/);await page.waitForTimeout(2000);
await page.mouse.click(1372,103);await wt(/Write a note only agents/);
const ed=page.locator('[contenteditable=true]').first();await ed.click();await page.keyboard.type('QA FT 1865 H comment with mention ');await page.keyboard.type('@mahmoud.ma');await page.waitForTimeout(3000);
out.suggest=await lines(/mahmoud/i,10);await shot('c2-mention-suggest');
const opt=page.locator('[role=option]:has-text("mahmoud.mahamed1515"), li:has-text("mahmoud.mahamed1515"), button:has-text("mahmoud.mahamed1515")').first();out.optCount=await opt.count();
if(out.optCount){await opt.click();}else{await page.keyboard.press('Enter');}
await page.waitForTimeout(1000);await page.keyboard.type(' please ignore.');await shot('c3-comment-typed');
await page.locator('button:has-text("Comment")').filter({hasText:'Private'}).first().click();await page.waitForTimeout(8000);
log('CREATED private comment with @mention of mahmoud.mahamed1515 (self) on ticket #2484');
out.after=await lines(/QA FT 1865 H comment|Private|@mahmoud/i,10);await shot('c4-comment-posted');
return Object.assign(out,{calls:[...new Set(calls)]});
