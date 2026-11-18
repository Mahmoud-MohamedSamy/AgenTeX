await page.goto(H+'/settings/security/audit-log',{waitUntil:'domcontentloaded'}); await sleep(15000);
const t=(await page.locator('main').last().innerText()).replace(/\s+/g,' ');
await shot('3029-1-audit-log.png');
const i=t.indexOf('RT19 3029');
return {len:t.length, around:t.slice(Math.max(0,i-300),i+2200)};
