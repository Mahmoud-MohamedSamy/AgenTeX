async (page) => { await page.mouse.move(800,628); await page.waitForTimeout(1500); await page.screenshot({path:'z/t11.png', clip:{x:680,y:520,width:320,height:300}}); return 'ok'; }
