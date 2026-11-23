await page.goto(H+'/settings/web-forms',{waitUntil:'commit'});await page.getByText('QA RT24 3138 crm empty').first().waitFor({timeout:120000});await sleep(3000);
await page.getByRole('button',{name:/Embed code/}).nth(2).click();await sleep(4000);
const h=page.getByText(/How to use it/i).last();await h.scrollIntoViewIfNeeded().catch(()=>log('nohow'));await sleep(1500);
log((await page.locator('[role=dialog]').last().innerText()).replace(/\s+/g,' ').match(/How to use it.{0,600}/i)?.[0]);await shot('3138-crm-embed-howto.png');
