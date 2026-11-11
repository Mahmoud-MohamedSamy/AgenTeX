await page.goto(H+'/activities',{waitUntil:'domcontentloaded'});
for(let i=0;i<30;i++){await sleep(2000); if(/All Activities \(\d+\)/.test(await text())) break;} await sleep(4000);
const t=await text(); log('owner count', (t.match(/All Activities \(\d+\)/)||[''])[0]);
const si=page.locator('input[placeholder*="earch" i]').first(); if(!(await si.isVisible().catch(()=>false))){ await page.locator('button:near(:text("All Activities"))').nth(1).click().catch(()=>{}); await sleep(800);}
await page.locator('input[placeholder*="earch" i]').first().fill('QA RT15 2830'); await page.keyboard.press('Enter'); await sleep(6000);
log((await text()).split('\n').filter(l=>/QA RT15 2830|Activities \(/.test(l)).slice(0,8));
await shot('2830-owner-activities-search.png');
