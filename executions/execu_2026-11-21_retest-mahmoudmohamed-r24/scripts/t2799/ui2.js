await page.goto(H+'/views/all/tickets/88c09ac2-12d4-438f-a650-d8df18d4ef2b',{waitUntil:'commit'});
await page.getByText('QA RT24 BP PRIV PRIV1 reply test').first().waitFor({timeout:120000});await sleep(4000);
await page.getByRole('button',{name:/^Actions/}).first().click();await sleep(1500);log('actions',await page.locator('[role=menu]').allInnerTexts().catch(()=>[]));await shot('2799-b-actions.png');
await page.keyboard.press('Escape');await sleep(800);
const lbls=await page.locator('main button[aria-label], [data-testid] button[aria-label]').evaluateAll(b=>b.map(x=>x.getAttribute('aria-label')));log('labels',lbls.slice(0,60));
