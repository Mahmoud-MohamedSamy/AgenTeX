async (page) => { await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/setup/landing', { waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(9000);
 const links = await page.$$eval('a', as => as.map(a => [a.innerText.trim(), a.getAttribute('href')]).filter(x => /skill|assign|customiz/i.test(x.join(' '))));
 return { url: page.url().replace(/\?.*/,''), links }; }
