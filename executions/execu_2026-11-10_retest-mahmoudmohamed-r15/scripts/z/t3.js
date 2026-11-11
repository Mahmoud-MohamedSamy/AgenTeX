async (page) => { const b = page.getByText('Assignment Rules', {exact:true}).first(); await b.click().catch(()=>{}); await page.waitForTimeout(3000);
 await page.screenshot({path:'z/t3a.png'}); const sub = await page.innerText('body'); return sub.split('\n').filter(Boolean).slice(0,200).filter(l=>/assign|round|direct|skill|rule/i.test(l)).slice(0,20); }
