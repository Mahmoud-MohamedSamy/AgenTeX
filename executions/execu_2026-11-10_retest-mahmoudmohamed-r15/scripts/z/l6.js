async (page) => { await page.mouse.wheel(0,-30000); await page.waitForTimeout(2000);
 const l = page.getByText('Select all tickets in this view'); const n = await l.count(); if (n) await l.first().click(); await page.waitForTimeout(3000);
 const t = await page.innerText('body'); await page.screenshot({path:'../screenshots/raw/zoho-2823-select-view.png'});
 const sel = await page.$$eval('[class*=check i][class*=ed i], [aria-checked=true]', a=>a.length).catch(()=>-1);
 return { n, bar: t.split('\n').slice(18,26).join('|'), sel }; }
