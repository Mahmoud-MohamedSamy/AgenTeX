async (page) => { await page.getByText('Direct Assignment', {exact:true}).first().click().catch(()=>{}); await page.waitForTimeout(30000);
 await page.screenshot({path:'z/t4.png'}); return page.url(); }
