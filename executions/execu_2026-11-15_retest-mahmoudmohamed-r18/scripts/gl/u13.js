await page.goto(H+'/modules/88e8ea44-1658-4df3-9930-d0902b91073d',{waitUntil:'domcontentloaded'}); await sleep(14000);
const s=page.locator('main input[type=search], main input[placeholder*=Search]').first();
const cnt=await s.count(); if(cnt){ await s.fill('QA RT18 3022'); await page.keyboard.press('Enter'); await sleep(6000); }
await shot('3022-2-list-search.png');
const t=(await page.locator('main').last().innerText()).replace(/\s+/g,' ');
await page.goto(H+'/views/all/tickets/637e248a-a282-4d6e-a443-d0ae78ac737e',{waitUntil:'domcontentloaded'}); await sleep(18000);
const b=(await page.locator('body').innerText()).replace(/\s+/g,' ');
await shot('3022-1-ticket-4061.png');
return {cnt,t:t.slice(0,700), dep:(b.match(/.{0,60}Customer Support.{0,60}/g)||[]).slice(0,4)};
