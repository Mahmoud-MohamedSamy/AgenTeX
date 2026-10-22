const stop = capOn();
await go('/', 8000);
await sleep(4000);
const t1 = (await txt()).slice(0, 600);
await page.getByText('Settings', { exact: true }).first().click().catch(()=>{});
await sleep(5000);
stop();
return done({ url: page.url(), t1, cap: cap.filter(c => !/translations|notifications/.test(c)).slice(0, 40), body: (await txt()).slice(0, 2500), shot: await shot('a2') });
