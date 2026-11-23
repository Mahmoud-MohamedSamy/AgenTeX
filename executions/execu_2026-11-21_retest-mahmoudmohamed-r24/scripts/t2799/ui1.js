await page.goto(H+'/views/all/tickets/88c09ac2-12d4-438f-a650-d8df18d4ef2b',{waitUntil:'commit'});
await page.getByText('QA RT24 BP PRIV PRIV1 reply test').first().waitFor({timeout:120000});await sleep(4000);
await page.locator('button:right-of(:text("Reply All"))').first().click().catch(e=>log('nocaret'));await sleep(1500);
log((await page.locator('[role=menu]').allInnerTexts().catch(()=>[])));await shot('2799-a-reply-menu.png');
