let step='nav';try{
await page.goto(H+'/team-feeds/08fd8684-c5c0-4d4d-86f9-2be70cf61e53/all',{waitUntil:'load',timeout:120000});await wt(/Share an update with HR/);await page.waitForTimeout(2000);
step='compose';await page.getByText('Share an update with HR…').click();await page.waitForTimeout(1500);
const ed=page.locator('[contenteditable=true]').first();await ed.click();await page.keyboard.type('QA FT 1865 H feed post, please ignore. @');await page.waitForTimeout(2500);
out.suggestAt=(await page.locator('[role=listbox], [role=option]').allInnerTexts()).slice(0,8);await shot('f2-feed-mention-list');
await page.keyboard.press('Backspace');await page.keyboard.press('Escape').catch(()=>{});
step='post';await page.locator('button').filter({hasText:/^Post to /}).first().click({timeout:10000});await page.waitForTimeout(6000);
log('CREATED Team Feeds post in HR feed (QA FT 1865 H feed post, no mention)');
out.after=await lines(/QA FT 1865 H feed post/i,4);await shot('f3-feed-posted');
}catch(e){out.err=step+': '+String(e).slice(0,140);await shot('f-err-'+step);}
return Object.assign(out,{calls:[...new Set(calls)]});
