const id='e74924f9-6bb4-49ee-85ff-ebdf795d669f';
out.loaded=await openTicket(id,'QA RC 1865 UI ticket');await page.waitForTimeout(2000);
// Reply menu options (arrow next to Reply All)
const arrow=page.locator('button:has-text("Reply All")').first().locator('xpath=following-sibling::button[1]');
if(await arrow.count()){await arrow.click();await page.waitForTimeout(1500);out.replyMenu=(await page.locator('[role=menu]').last().innerText().catch(()=>'')).split('\n');await shot('b1-ui-reply-menu');await page.keyboard.press('Escape');await page.waitForTimeout(800);}
await page.locator('button:has-text("Reply All")').first().click();await wt(/Insert template/);await page.waitForTimeout(3000);
out.before=await composerInfo();
const rcp=page.getByPlaceholder('Add a recipient').first();await rcp.click();await page.keyboard.type('mmohamed@anyware.software');await page.keyboard.press('Enter');await page.waitForTimeout(1200);
const ed=page.locator('[contenteditable=true]').first();await ed.click();await page.keyboard.press('Control+Home');await page.keyboard.type('QA RC 1865 reply 1 (UI ticket). Please ignore.');await page.waitForTimeout(1500);
out.filled=await composerInfo();await shot('b1-ui-reply1-filled');
await page.locator('button:has-text("Send")').filter({hasNotText:'review'}).first().click();await page.waitForTimeout(9000);
out.afterSend=await lines(/QA RC 1865 reply 1|Sent|Queued|Failed/i,8);
log('SENT reply 1 on ticket #2543 (e74924f9, UI-created) To mmohamed@anyware.software (added by hand; Recipients was empty) From Tech <tech@help-staging.anyware.software>');
// reload and Reply All again
out.reloaded=await openTicket(id,'QA RC 1865 UI ticket');await wt(/QA RC 1865 reply 1/,60000);await page.waitForTimeout(2500);
await page.locator('button:has-text("Reply All")').first().click();await wt(/Insert template/);await page.waitForTimeout(3500);
out.second=await composerInfo();await shot('b1-ui-replyall-2-after-reply1');
return Object.assign(out,{calls:[...new Set(calls)]});
