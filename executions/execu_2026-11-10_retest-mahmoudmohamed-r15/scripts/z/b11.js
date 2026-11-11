async (page) => { await page.mouse.click(1212,312); await page.waitForTimeout(2000);
 await page.screenshot({path:'z/b11.png'}); const t = await page.innerText('body'); return t.split('\n').filter(Boolean).filter(l=>l.length<40).slice(0,80).join(' | '); }
