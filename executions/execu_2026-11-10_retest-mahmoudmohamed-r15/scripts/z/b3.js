async (page) => { const b = page.getByText('Blueprint', {exact:true}).first(); await b.scrollIntoViewIfNeeded().catch(()=>{}); await b.click().catch(e=>{}); await page.waitForTimeout(35000);
 await page.screenshot({path:'z/b3.png'}); let ft=''; for (const f of page.frames()) { if (f===page.mainFrame()) continue; const x = await f.innerText('body').catch(()=>''); if (x.length>ft.length) ft = x; }
 return { url: page.url(), ft: ft.replace(/\n+/g,' | ').slice(0,1200) }; }
