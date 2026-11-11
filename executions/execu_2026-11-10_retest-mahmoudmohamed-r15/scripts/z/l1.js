async (page) => { await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/list/all-cases',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(20000);
 await page.screenshot({path:'../screenshots/raw/zoho-2823-list.png'});
 const t = await page.innerText('body'); return { n: (t.match(/QA RT15 2823/g)||[]).length, tail: t.slice(-600), head: t.slice(0,400) }; }
