async (page, frame) => { await page.waitForTimeout(15000); let t = await page.innerText('body');
 if (!/Blueprint/i.test(t.slice(600))) { await page.fill('input[placeholder="Search in Setup"]','Blueprint').catch(()=>{}); await page.waitForTimeout(2500); const b = page.getByText(/^Blueprints?$/).first(); await b.click().catch(()=>{}); await page.waitForTimeout(30000); }
 await page.screenshot({path:'z/b2.png'}); const fr = page.frames().map(f=>f.url().slice(0,80)); let ft=''; for (const f of page.frames()) { const x = await f.innerText('body').catch(()=>''); if (/Blueprint/i.test(x) && x.length>ft.length) ft = x; }
 return { url: page.url(), ft: ft.replace(/\n+/g,' | ').slice(0,1500) }; }
