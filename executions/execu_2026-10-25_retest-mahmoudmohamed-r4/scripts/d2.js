await page.goto(H + '/settings/modules-and-fields', { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); if (/Time Entries|Contracts/.test(await txt().catch(() => ''))) break; } await sleep(2000);
const rows = await page.evaluate(() => [...document.querySelectorAll('tbody tr')].map(r => r.innerText.replace(/\s+/g, ' ').trim().slice(0, 120)));
await shot('2250-01-module-list');
return done({ url: page.url().replace(H, ''), rows });
