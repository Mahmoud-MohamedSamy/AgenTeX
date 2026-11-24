await page.goto(H + '/', { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => document.querySelector('input[type=password]') || document.querySelector('[data-testid="tia-launcher"]') || document.querySelector('nav'), null, { timeout: 90000 }).catch(() => {});
await page.waitForTimeout(3000);
log('url', page.url(), 'pw', await page.locator('input[type=password]').count(), 'launcher', await page.locator('[data-testid="tia-launcher"]').count(), 'nav', await page.locator('nav').count());
log('body', (await text()).replace(/\n+/g, ' / ').slice(0, 200));
await shot('crm-dbg3');
return 'ok';
