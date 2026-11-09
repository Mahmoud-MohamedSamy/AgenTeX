await page.goto('https://crm.zoho.com/crm/org943261092/settings/email-configuration', { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForTimeout(12000);
return await page.evaluate(() => [...document.querySelectorAll('a[href*="email"]')].map(a => (a.innerText || '').trim().slice(0, 40) + ' -> ' + a.getAttribute('href')).filter(s => s.length > 5).slice(0, 30));
