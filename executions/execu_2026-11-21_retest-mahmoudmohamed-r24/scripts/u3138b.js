await page.goto(H+'/settings/web-forms',{waitUntil:'commit'});await page.getByText('QA RT24 3138 crm empty').first().waitFor({timeout:120000});await sleep(3000);
await page.getByRole('button',{name:/Embed code/}).nth(2).click();await sleep(4000);
const d=page.locator('[role=dialog]').last();log((await d.innerText()).replace(/\s+/g,' ').replace(/fw1\.[\w.-]+/g,'<key>').slice(0,900));await shot('3138-crm-embed.png');
