async (page) => { await page.waitForTimeout(15000); return page.url() + ' | ' + (await page.innerText('body')).slice(0, 300).replace(/\s+/g, ' '); }
