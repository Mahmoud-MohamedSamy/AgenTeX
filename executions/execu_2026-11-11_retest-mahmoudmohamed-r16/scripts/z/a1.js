async (page) => { await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tasks/list/all-tasks',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(18000);
 await page.screenshot({path:'../screenshots/raw/zoho-2635-tasks-list.png'}); const t = await page.innerText('body'); return { url: page.url(), t: t.slice(0, 1800) }; }
