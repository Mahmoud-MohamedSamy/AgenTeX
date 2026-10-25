const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LT = '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1';
await page.goto(H + `/settings/modules-and-fields/${L}/layouts/${LT}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 90; k++) { await sleep(1000); if ((await txt().catch(() => '')).includes('QA RT Temp Number')) break; }
await sleep(1500);
const fld = page.getByText('QA RT Temp Number', { exact: true }).first(); await fld.scrollIntoViewIfNeeded(); await fld.hover(); await sleep(600);
await shot('2106-01-layout-field');
const near = await page.evaluate(() => { const el = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'QA RT Temp Number'); let c = el; for (let k = 0; k < 6; k++) { c = c.parentElement; if (c.querySelectorAll('button').length) break; } return [...c.querySelectorAll('button')].map(b => (b.getAttribute('aria-label') || b.title || b.innerText).trim()); });
return done({ near });
