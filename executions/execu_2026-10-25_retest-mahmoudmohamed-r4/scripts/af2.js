const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LT1 = '114a5fb6-0a30-4b2c-ac9c-e8c3e51a21f1';
await page.goto(H + `/modules/${L}/records/new?layout=${LT1}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); if (/Fill From Name/.test(await txt().catch(() => ''))) break; } await sleep(2500);
const inputs = await page.evaluate(() => [...document.querySelectorAll('input, textarea')].filter(i => i.offsetParent).map(i => { const lab = i.closest('div[class*=grid], div[class*=row], label')?.innerText?.split('\n')[0] || ''; return (i.getAttribute('aria-label') || i.placeholder || i.name || '') + ' [' + lab.slice(0, 25) + '] =' + i.value; }).slice(0, 30));
return done({ inputs });
