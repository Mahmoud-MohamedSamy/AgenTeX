const resp = []; const f = async r => { const u = r.url(); if (u.includes('/api/') && !/auth|notif|hubs/.test(u)) resp.push(r.request().method() + ' ' + u.replace(H + '/api/v1', '').slice(0, 140) + ' ' + r.status()); }; page.on('response', f);
await go('/settings/pipelines', 25000);
page.off('response', f);
const ok = !!(await page.getByText('QA RT 1325 pipeline', { exact: true }).count());
return done({ ok, resp: resp.filter(x => /modules|pipel|stage/.test(x)) });
