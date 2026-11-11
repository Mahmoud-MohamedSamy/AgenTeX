async (page) => { await page.mouse.click(1418,312); await page.waitForTimeout(1500); await page.screenshot({path:'../screenshots/raw/zoho-2729-fu-priority-open.png'});
 await page.keyboard.press('Escape'); await page.waitForTimeout(800);
 const res = {}; for (const q of ['Team','Depart','Skill','Classif']) { await page.mouse.click(1212,312); await page.waitForTimeout(1200); await page.keyboard.type(q); await page.waitForTimeout(1200);
   await page.screenshot({path:`z/b13-${q}.png`, clip:{x:1130,y:280,width:470,height:300}}); for (let i=0;i<q.length;i++) await page.keyboard.press('Backspace'); await page.keyboard.press('Escape'); await page.waitForTimeout(600); }
 return 'ok'; }
