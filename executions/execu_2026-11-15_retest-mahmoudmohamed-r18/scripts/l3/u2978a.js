await page.goto(H+'/views',{waitUntil:'domcontentloaded'}); await sleep(10000);
await page.mouse.click(965,28); await sleep(2500);
log('url',page.url().replace(H,'')); const t=await text(); log('after', t.slice(0,600).replace(/\n+/g,' | '));
await shot('2978-0-plus.png');
