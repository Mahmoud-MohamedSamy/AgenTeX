await page.goto(H+'/views/all/tickets/88c09ac2-12d4-438f-a650-d8df18d4ef2b',{waitUntil:'commit'});
await page.getByText('QA RT24 BP PRIV PRIV1 reply test').first().waitFor({timeout:120000});await sleep(4000);
await page.getByRole('button',{name:'More ticket actions'}).click();await sleep(1500);log('more',await page.locator('[role=menu]').allInnerTexts().catch(()=>[]));await shot('2799-c-more.png');
await page.keyboard.press('Escape');await sleep(800);
await page.getByRole('button',{name:'More ways to reply'}).click();await sleep(1500);log('ways',await page.locator('[role=menu]').allInnerTexts().catch(()=>[]));
