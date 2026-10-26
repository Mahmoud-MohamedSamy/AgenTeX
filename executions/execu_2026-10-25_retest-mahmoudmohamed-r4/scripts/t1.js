// Teamspace: list page, then Create New Teamspace with zero modules (NDC-1694).
await page.goto(H + '/settings/teamspace', { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); if (/Create New Teamspace/.test(await txt().catch(() => ''))) break; } await sleep(1500);
const list = (await txt()).split('Create New Teamspace')[1]?.slice(0, 500);
await shot('ts-00-list');
await page.getByRole('button', { name: /Create New Teamspace/ }).first().click(); await sleep(2500);
const form = (await txt()).slice((await txt()).indexOf('Teamspace'), 1500);
const ctrls = await page.evaluate(() => [...document.querySelectorAll('#main-content input, #main-content button, #main-content textarea, main input, main button')].map(e => (e.tagName + ' ' + (e.getAttribute('aria-label') || e.placeholder || '') + ' | ' + (e.value || e.innerText || '').trim()).slice(0, 70)).slice(0, 40));
await shot('1694-01-create-form');
return done({ list, url: page.url().replace(H, ''), ctrls });
