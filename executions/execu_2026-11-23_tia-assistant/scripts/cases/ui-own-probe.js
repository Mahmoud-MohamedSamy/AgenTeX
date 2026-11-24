await page.goto(H + '/settings/integrations/tia', { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => document.querySelector('input[type=password]') || document.body.innerText.includes('Tia'), null, { timeout: 90000 }).catch(() => {});
await page.waitForTimeout(3000); log('url', page.url(), 'pw', await page.locator('input[type=password]').count()); await shot('own-desk-probe');
return 'ok';
