async (page) => { await page.goto('https://desk.zoho.com/agent/techsolutionsegypt/setup/skills', { waitUntil: 'domcontentloaded' }).catch(()=>{}); await page.waitForTimeout(9000);
 return { url: page.url().replace(/\?.*/,''), text: (await page.innerText('body')).slice(0, 2500) }; }
