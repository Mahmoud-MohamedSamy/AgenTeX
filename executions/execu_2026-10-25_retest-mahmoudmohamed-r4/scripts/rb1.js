await page.goto(H + '/settings/data/recycle-bin', { waitUntil: 'commit', timeout: 90000 }); for (let k = 0; k < 60; k++) { await sleep(1000); if (/Recycle Bin/.test(await txt().catch(() => '')) && /items?|Empty/.test(await txt().catch(() => ''))) break; } await sleep(2500);
const head = (await txt()).split('Recycle Bin')[1]?.slice(0, 500);
const ctrls = await page.evaluate(() => [...document.querySelectorAll('#main-content button, #main-content select, #main-content [role=combobox], main button')].map(e => (e.tagName + ' ' + (e.getAttribute('aria-label') || '') + ' | ' + (e.innerText || e.value || '').trim()).slice(0, 60)).slice(0, 25));
await shot('rb-00-bin');
return done({ head, ctrls });
