await page.goto('https://crm.zoho.com/crm/org943261092/settings/index', { waitUntil: 'domcontentloaded', timeout: 90000 }).catch(() => {});
await page.waitForTimeout(12000);
return await page.evaluate(() => [...document.querySelectorAll('a,[data-href],[href]')].map(a => (a.innerText || '').trim() + ' -> ' + (a.getAttribute('href') || a.getAttribute('data-href') || '')).filter(s => /^(Email|Webforms|Portals|Notification SMS|Telephony|Templates|Calendar|Activities|Notifications?)\b/.test(s)).slice(0, 30));
