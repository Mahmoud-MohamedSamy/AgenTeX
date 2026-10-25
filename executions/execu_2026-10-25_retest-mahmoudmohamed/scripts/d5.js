const o = page.locator('.ce-overlay-backdrop-enter');
await o.getByRole('textbox').first().fill('QA RT 2113 kb');
const resp = []; const f = async r => { const q = r.request(); if (q.method() === 'POST' && /\/views$/.test(q.url().split('?')[0])) resp.push(r.status() + ' ' + ((await r.json().catch(() => ({})))?.data?.id || '')); }; page.on('response', f);
await o.getByRole('button', { name: 'Save', exact: true }).click();
for (let k = 0; k < 20 && !resp.length; k++) await sleep(1000);
page.off('response', f);
for (let k = 0; k < 60; k++) { await sleep(1000); if ((await txt()).includes('Unaccounted')) break; }
await sleep(2000); await shot('2113-01-board');
const cols = await page.evaluate(() => [...document.querySelectorAll('[data-column-id], [aria-roledescription*=column i], section[aria-label], [role=region][aria-label]')].map(c => (c.getAttribute('aria-label') || c.getAttribute('data-column-id') || '').slice(0, 50)).slice(0, 20));
return done({ resp, has: (await txt()).includes('Unaccounted'), cols });
