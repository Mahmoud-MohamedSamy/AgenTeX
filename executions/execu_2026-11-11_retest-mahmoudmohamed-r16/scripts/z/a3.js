async (page) => { await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/alldepartment/calls/list/all-calls',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(18000);
 await page.screenshot({path:'../screenshots/raw/zoho-2635-calls-alldept.png'}); const t = await page.innerText('body'); return { url: page.url(), t: t.slice(0, 1800) }; }
