await page.goto('https://staging-crm.taviportal.com/settings', { waitUntil: 'domcontentloaded' }); await page.waitForTimeout(4000);
return { me: (await call('GET', '/iam/me/profile')).s };
