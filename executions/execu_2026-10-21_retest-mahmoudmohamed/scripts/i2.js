const resp = []; const f = async r => { const u = r.url(); if (u.includes('/api/') && /remind|setting/i.test(u) && !/resolved-batch|hierarchy/.test(u)) resp.push(r.request().method() + ' ' + u.replace(H + '/api/v1', '').slice(0, 160) + ' ' + r.status() + ' ' + (await r.text().catch(() => '')).slice(0, 1200)); }; page.on('response', f);
await go('/settings', 8000);
await page.getByText('Activity Reminders', { exact: true }).first().click(); await sleep(8000);
page.off('response', f);
const t = (await txt()).split('Storage Requests')[1]?.slice(0, 2500);
await shot('1333-01-page');
return done({ url: page.url(), t, resp });
