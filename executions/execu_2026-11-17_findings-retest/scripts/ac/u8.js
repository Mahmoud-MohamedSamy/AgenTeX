await page.goto(H+'/hq',{waitUntil:'domcontentloaded'}); await sleep(10000);
await page.getByRole('button',{name:/Notifications/}).click(); await sleep(4000); await shot('A5-1-c-bell.png');
log((await text()).match(/[^\n]*#5091[^\n]*/g));
