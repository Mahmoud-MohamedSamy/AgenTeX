async (page) => { await page.mouse.move(800,147); await page.waitForTimeout(1500); await page.screenshot({path:'z/r2.png', clip:{x:230,y:120,width:1370,height:60}}); return 'ok'; }
