async (page) => { const drag = async (x1,y1,x2,y2) => { await page.mouse.move(x1,y1); await page.mouse.down(); for (let i=1;i<=15;i++){ await page.mouse.move(x1+(x2-x1)*i/15, y1+(y2-y1)*i/15); await page.waitForTimeout(40);} await page.mouse.up(); await page.waitForTimeout(1500); };
 await drag(1213,212,350,250); await drag(1213,267,350,550);
 await page.screenshot({path:'z/b6.png'}); return 'ok'; }
