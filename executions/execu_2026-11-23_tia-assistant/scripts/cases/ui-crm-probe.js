await page.goto(H + '/', { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => document.querySelector('input[type=password]') || document.querySelector('[data-testid="tia-launcher"]'), null, { timeout: 90000 }).catch(() => {});
await page.waitForTimeout(2000);
log('url', page.url(), 'pw', await page.locator('input[type=password]').count(), 'launcher', await page.locator('[data-testid="tia-launcher"]').count());
await shot('crm-owner-probe');
return 'ok';
