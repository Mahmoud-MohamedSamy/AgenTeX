async (page) => { await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/setup', { waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(9000);
 await page.locator('text=/^Layouts and Fields$/').first().click(); await page.waitForTimeout(1500);
 const subs = await page.$$eval('a,li,span', es => [...new Set(es.filter(e => e.offsetParent && e.textContent.trim().length<30 && /layout|field|ticket/i.test(e.textContent)).map(e=>e.textContent.trim()))]);
 return subs.slice(0,30); }
