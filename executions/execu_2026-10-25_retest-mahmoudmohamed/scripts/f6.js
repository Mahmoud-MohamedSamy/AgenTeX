const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LT = '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1';
await page.goto(H + `/settings/modules-and-fields/${L}/layouts/${LT}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 90; k++) { await sleep(1000); if ((await txt().catch(() => '')).includes('QA RT Temp Number')) break; }
await sleep(1500);
const rm = await page.evaluateHandle(() => { const el = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'QA RT Temp Number'); let c = el; for (let k = 0; k < 6; k++) { c = c.parentElement; const b = c.querySelector('button[aria-label="Remove from Layout"]'); if (b) return b; } });
await rm.asElement().scrollIntoViewIfNeeded(); await rm.asElement().click({ force: true }); await sleep(1200);
const dlg1 = await page.evaluate(() => document.querySelector('[role=alertdialog], [role=dialog]')?.innerText.slice(0, 400) || null);
await shot('2106-02-removed');
const unused = await page.evaluate(() => { const t = document.body.innerText; const i = t.indexOf('Unused Fields'); return t.slice(i, i + 200); });
return done({ dlg1, unused });
