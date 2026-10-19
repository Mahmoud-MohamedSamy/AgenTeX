const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V = 'caa66e4f-9c0b-4b1a-9f6e-ba96ac8fac5a'; const out = { n: 0, reqs: 0 };
const fr = r => { if (/\/records\?/.test(r.url())) out.reqs++; }; page.on('request', fr);
await shot('NDC-2095-view-today-after-reload');
out.afterReloadView = ((await txt()).match(/Choose a view|QA RT tz-day/) || [''])[0];
await page.goto(H + '/home', { waitUntil: 'load' }); await sleep(5000);
await page.goto(H + '/modules/' + L + '?view=' + V, { waitUntil: 'load', timeout: 90000 });
for (let i = 0; i < 30; i++) { await sleep(1000); if (/[1-9]\d* records?/.test(await txt())) break; }
await sleep(2000); out.ui = ((await txt()).match(/\d+ records?/) || [''])[0]; out.rows = (await page.locator('tbody').last().innerText()).replace(/\s+/g, ' ').slice(0, 200);
await shot('NDC-2095-view-today');
page.off('request', fr); return done(out);
