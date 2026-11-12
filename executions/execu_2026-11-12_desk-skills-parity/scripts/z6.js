async (page) => { const l = page.locator('text=/^Skills$/').first(); await l.click(); await page.waitForTimeout(8000);
 const t = await page.innerText('body'); const i = t.indexOf('PERSONALIZATION'); 
 return { url: page.url().replace(/\?.*/,''), text: t.slice(i > 0 ? i : 0, (i>0?i:0)+3500) }; }
