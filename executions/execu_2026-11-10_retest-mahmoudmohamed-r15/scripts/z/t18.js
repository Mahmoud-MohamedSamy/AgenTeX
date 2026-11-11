async (page, frame) => { const f = frame(); const fe = await f.evaluate(()=>{const a=document.activeElement; return a? a.tagName+' '+(a.placeholder||'')+' '+String(a.className).slice(0,50):''});
 if (/^INPUT/.test(fe)) { await page.keyboard.type('Subject'); await page.waitForTimeout(1500); }
 await page.screenshot({path:'z/t18.png', clip:{x:680,y:250,width:500,height:360}}); return fe; }
