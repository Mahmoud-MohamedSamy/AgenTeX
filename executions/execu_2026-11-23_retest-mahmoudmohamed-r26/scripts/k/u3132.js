await page.goto(H+'/settings/data/import',{waitUntil:'domcontentloaded'});
for(let i=0;i<40;i++){await sleep(3000);const t=await page.locator('body').innerText().catch(()=>'');if(/import/i.test(t)&&/upload|file|drag/i.test(t))break;}
await sleep(2000);await shot('3132-1.png');const t=(await page.locator('#main-content').innerText()).replace(/\s+/g,' ');
return {t:t.slice(0,1500),btns:(await page.locator('#main-content button:visible').allInnerTexts()).map(s=>s.trim()).filter(Boolean)};
