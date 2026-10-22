const resp = []; const f = async r => { const u = r.url(); if (/login-history|sessions|audit\/log/i.test(u)) resp.push(r.request().method() + ' ' + u.replace(H + '/api/v1', '').slice(0, 160) + ' ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 2500)); }; page.on('response', f);
await go('/settings', 8000);
await page.getByText('Login History', { exact: true }).first().click(); await sleep(9000);
page.off('response', f);
const t = (await txt()).split('Storage Requests')[1]?.slice(0, 2500);
await shot('1422-01-login-history');
return done({ url: page.url(), t, resp: resp.map(x => x.slice(0, 2600)) });
