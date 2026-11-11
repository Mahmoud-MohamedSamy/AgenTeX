async (page) => { await page.mouse.click(834,333); await page.waitForTimeout(800); const fe = await page.evaluate(()=>{const a=document.activeElement; return a? a.tagName+' '+(a.placeholder||a.className||'').toString().slice(0,60):''}); 
 if (/INPUT|TEXTAREA/.test(fe) || /true/.test(await page.evaluate(()=>String(document.activeElement?.isContentEditable)))) { await page.keyboard.type('Subject'); await page.waitForTimeout(1500); }
 await page.screenshot({path:'z/t17.png', clip:{x:680,y:250,width:500,height:360}}); return fe; }
