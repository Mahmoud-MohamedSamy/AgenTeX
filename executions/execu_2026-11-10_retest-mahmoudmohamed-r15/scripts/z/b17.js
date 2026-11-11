async (page) => { await page.mouse.click(816,228); await page.waitForTimeout(15000); await page.screenshot({path:'z/b17.png'}); return (await page.innerText('body')).includes('QA RT15 2729') ; }
