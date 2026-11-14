async (page) => { await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/details/1475109000000530042',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(15000);
 await page.screenshot({path:'../screenshots/raw/zoho-2635-ticket-before.png'});
 const t = await page.innerText('body'); const btns = await page.$$eval('[role=tab], button, [data-id]', bs => bs.map(b => (b.innerText||b.getAttribute('aria-label')||b.getAttribute('data-title')||'').trim()).filter(x => x && x.length < 40)).catch(()=>[]);
 return { t: t.slice(0, 1500), btns: [...new Set(btns)].slice(0, 80) }; }
