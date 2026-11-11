async (page) => { await page.mouse.click(410,172); await page.keyboard.type('QA RT15 2729 blueprint'); await page.waitForTimeout(500);
 await page.mouse.click(325,845); await page.waitForTimeout(20000);
 await page.screenshot({path:'z/b5.png'}); return (await page.innerText('body')).split('\n').filter(Boolean).slice(0,40).join(' | '); }
