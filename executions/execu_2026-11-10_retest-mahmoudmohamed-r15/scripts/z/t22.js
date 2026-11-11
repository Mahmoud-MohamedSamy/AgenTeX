async (page) => { await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/tech/tickets/details/1475109000000556106',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(25000);
 const nn = page.getByText('Not Now',{exact:true}); if (await nn.count()) await nn.first().click().catch(()=>{});
 await page.screenshot({path:'../screenshots/raw/zoho-2794-ticket.png'}); const t = await page.innerText('body'); return t.split('\n').filter(Boolean).filter(l=>/team|owner|test|Fathy/i.test(l)).slice(0,15); }
