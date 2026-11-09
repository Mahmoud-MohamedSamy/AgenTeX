await page.goto(H+'/hq',{waitUntil:'domcontentloaded',timeout:90000}); await sleep(15000); return done({url:page.url(), t:(await txt()).replace(/\s+/g,' ').slice(0,300), hdr:!!hdr});
