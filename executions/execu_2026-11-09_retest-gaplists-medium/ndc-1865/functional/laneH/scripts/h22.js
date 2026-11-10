out.loaded=await openTicket();await page.waitForTimeout(2000);
let step='open';try{
await page.mouse.click(1372,103);await wt(/Write a note only agents/);await page.waitForTimeout(1000);
step='type';const ed=page.locator('[contenteditable=true]').first();await ed.click();await page.keyboard.press('Control+A');await page.keyboard.type('QA FT 1865 H public comment: notification rule check, please ignore.');
step='vis';await page.locator('button[aria-label="Comment visibility"]').click();await page.waitForTimeout(1000);await page.locator('[role=menuitem], [role=menuitemradio]').filter({hasText:/^Public$/}).first().click();await page.waitForTimeout(1000);
out.btn=await page.locator('button').filter({hasText:/^Comment/}).first().innerText();
if(!/Public/.test(out.btn))throw new Error('not public: '+out.btn);
step='post';await page.locator('button').filter({hasText:/^Comment/}).first().click();await page.waitForTimeout(8000);
log('CREATED public comment on ticket #2484 (Tech) — rule contact.comment_added is on, so a notification email may go to the contact mmohamed@anyware.software');
out.after=await lines(/QA FT 1865 H public comment|Public/,6);await shot('n2-public-comment');
step='history';await page.locator('text=/^\s*history\s*$/i').first().click({timeout:15000});await page.waitForTimeout(6000);
out.history=await lines(/notif|email|mail|sent|comment|reply|QA FT/i,25);await shot('n3-history');
}catch(e){out.err=step+': '+String(e).slice(0,140);await shot('n-err-'+step);}
return Object.assign(out,{calls:[...new Set(calls)]});
