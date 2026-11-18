await page.goto(H+'/settings/channels/email',{waitUntil:'domcontentloaded'}); await sleep(10000);
await page.getByRole('tab',{name:/Your domains/}).click().catch(async()=>page.getByText(/^Your domains/).first().click());
await sleep(3000);
const m=(await page.locator('main').last().innerText()).replace(/\s+/g,' ');
const btns=await page.locator('main button').allInnerTexts();
await shot('3002-0-domains.png');
return {m:m.slice(0,2500),btns};
