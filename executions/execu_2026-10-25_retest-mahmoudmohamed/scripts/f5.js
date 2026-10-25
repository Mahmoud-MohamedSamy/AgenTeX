const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LS = 'bf971461-2edc-45f2-b6e4-6e180aa64288';
await page.goto(H + `/settings/modules-and-fields/${L}/layouts/${LS}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 90; k++) { await sleep(1000); if ((await txt().catch(() => '')).includes('Unused Fields')) break; }
await sleep(1500);
await page.getByText('Unused Fields', { exact: true }).first().click(); await sleep(1200);
const s = page.getByPlaceholder(/search/i).first(); if (await s.count()) { await s.fill('QA RT Temp'); await sleep(1000); }
await shot('2106-02-unused');
const near = await page.evaluate(() => { const el = [...document.querySelectorAll('*')].filter(e => e.childElementCount === 0 && e.textContent.trim() === 'QA RT Temp Number').pop(); if (!el) return 'not found'; let c = el; for (let k = 0; k < 6; k++) { c = c.parentElement; if (c.querySelectorAll('button').length) break; } return [...c.querySelectorAll('button')].map(b => (b.getAttribute('aria-label') || b.title || b.innerText).trim()); });
return done({ near, placeholders: await page.evaluate(() => [...document.querySelectorAll('input')].map(i => i.placeholder).filter(Boolean)) });
