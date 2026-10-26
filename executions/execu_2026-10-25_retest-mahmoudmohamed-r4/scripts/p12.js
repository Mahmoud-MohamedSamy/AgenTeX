const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const errs = []; const fc = m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); }; page.on('console', fc);
const bad = []; const fr = r => { if (r.status() >= 400 && /\/api\//.test(r.url()) && !/iam\/auth/.test(r.url())) bad.push(r.status() + ' ' + r.url().replace(H, '').slice(0, 120)); }; page.on('response', fr);
await page.goto(H + `/modules/${D}`, { waitUntil: 'commit', timeout: 90000 });
for (let k = 0; k < 60; k++) { await sleep(1000); const t = await txt().catch(() => ''); if (/\d+ records|Something went wrong/.test(t)) break; } await sleep(2000);
page.off('console', fc); page.off('response', fr);
const t = await txt(); const prefs = (await api('GET', `/modules/${D}/list-preferences`)).j?.data;
await shot('1324-00-list-reload');
return done({ crashed: /Something went wrong/.test(t), count: (t.match(/\d+ records/) || [])[0], errs: errs.slice(0, 6), bad: bad.slice(0, 6), prefs: JSON.stringify(prefs).slice(0, 300) });
