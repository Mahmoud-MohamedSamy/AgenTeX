async (page) => { await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/list/all-cases',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(15000);
 const links = await page.$$eval('a[href*="/tickets/details/"]', as => [...new Set(as.map(a => a.getAttribute('href')))].slice(0,5));
 const t = await page.innerText('body'); return { links, t: t.slice(0, 900) }; }
