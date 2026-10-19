capOn();
await page.getByText('Work Queue', { exact: true }).first().click(); await sleep(9000);
await shot('wq-landing');
return done({ url: page.url(), body: (await txt()).slice(0, 2500), calls: cap.filter(c => !/notifications|telephony|unread/.test(c)).slice(0, 30) });
