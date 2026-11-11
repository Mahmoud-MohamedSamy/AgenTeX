async (page) => { await page.mouse.click(560,164); await page.waitForTimeout(1000);
 await page.mouse.move(560,182); await page.mouse.down(); for (let i=1;i<=20;i++){ await page.mouse.move(560+(363-560)*i/20, 182+(545-182)*i/20); await page.waitForTimeout(40);} await page.mouse.up(); await page.waitForTimeout(3000);
 await page.screenshot({path:'z/b7.png'}); return 'ok'; }
