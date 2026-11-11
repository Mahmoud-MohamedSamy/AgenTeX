async (page) => { await page.mouse.click(1477,72); await page.waitForTimeout(8000);
 await page.screenshot({path:'z/b4.png'}); return (await page.innerText('body')).split('\n').filter(Boolean).slice(-60).join(' | '); }
