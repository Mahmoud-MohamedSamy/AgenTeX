const ID = '01727195-e2d5-41c5-821b-a30d5a965976';
await page.goto(H + '/hq', { waitUntil: 'commit', timeout: 90000 }); await sleep(4000);
await page.getByRole('button', { name: /^EN|language/i }).first().click(); await sleep(800); await page.getByText('العربية').first().click(); await sleep(4000);
await page.goto(H + `/settings/modules-and-fields/${ID}`, { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 40; k++) { await sleep(1000); if (/التخطيطات|Layouts/.test(await txt().catch(() => ''))) break; } await sleep(1500);
const lt = page.getByText(/^(التخطيطات|Layouts)$/).first(); await lt.click().catch(() => {}); await sleep(2500);
const t = await txt(); const english = t.split('\n').map(s => s.trim()).filter(s => /^[A-Za-z][A-Za-z ]{3,}$/.test(s) && !/QA RT|Default|CRM|Desk|EN|AR|MA|MS/.test(s));
const head = await page.evaluate(() => [...document.querySelectorAll('thead th')].map(t => t.innerText.trim()));
await shot('2249-01-layouts-ar');
return done({ dir: await page.evaluate(() => document.documentElement.dir), head, english: [...new Set(english)].slice(0, 30) });
