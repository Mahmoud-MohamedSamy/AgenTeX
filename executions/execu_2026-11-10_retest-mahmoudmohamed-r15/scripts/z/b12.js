async (page) => { await page.keyboard.type('Stat'); await page.waitForTimeout(1500); await page.screenshot({path:'z/b12a.png', clip:{x:1130,y:280,width:470,height:300}});
 for (let i=0;i<4;i++) await page.keyboard.press('Backspace'); await page.keyboard.type('Prior'); await page.waitForTimeout(1200); await page.keyboard.press('Enter'); await page.waitForTimeout(2500);
 await page.screenshot({path:'../screenshots/raw/zoho-2729-fu-priority.png'}); return 'ok'; }
