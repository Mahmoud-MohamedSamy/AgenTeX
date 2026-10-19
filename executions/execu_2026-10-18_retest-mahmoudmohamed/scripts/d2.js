const stop = capOn();
await page.getByText('Recycle Bin', { exact: true }).first().click(); await sleep(9000);
await shot('NDC-1821-recycle-bin-before');
const u1 = page.url();
await page.getByText('Company Settings', { exact: true }).first().click().catch(() => {}); await sleep(6000);
stop();
return done({ rbUrl: u1, csUrl: page.url(), calls: cap.filter(c => /recycle|bin|settings\/(defs|definitions|values)|company/i.test(c)).map(c => c.slice(0, 300)).slice(0, 10), cs: (await txt()).slice(900, 2200) });
