async (page) => { await page.getByText('QA RT16 2635 task', { exact: true }).first().click(); await page.waitForTimeout(8000);
 await page.screenshot({path:'../screenshots/raw/zoho-2635-task-page.png'});
 const btns = await page.$$eval('button, [role=button], a, span[title], i[title]', bs => bs.filter(b => b.offsetParent).map(b => (b.innerText || b.getAttribute('aria-label') || b.title || b.getAttribute('data-title') || '').trim()).filter(x => x && x.length < 30));
 return { url: page.url(), btns: [...new Set(btns)].slice(0, 70) }; }
