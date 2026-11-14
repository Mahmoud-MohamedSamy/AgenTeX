const T1 = 'a9a4c545-cd24-451a-ae7d-6025f16b4797', T2 = '4d03a01e-9d79-488f-a45e-5be055069a66';
// bulk via the ticket list screen: search, select both, change status
await go('/tickets', 10000);
const G = []; const onG = r => { const u = r.url(); if (u.includes('/api/v1/') && r.request().method() !== 'GET') G.push(r.request().method() + ' ' + u.replace(API, '').split('?')[0] + ' ' + r.status()); }; page.on('response', onG);
const s = page.getByPlaceholder(/Search/i).first(); out.hasSearch = await s.count();
const b = await api('POST', '/desk/tickets/bulk/status', { ticket_ids: [T1, T2], status: 'Closed' }); out.bulk = b.s + ' ' + b.t.slice(0, 200);
await sleep(4000);
await go('/settings/data/bulk-actions', 10000);
out.log = (await page.locator('body').innerText()).replace(/\s+/g, ' ').replace(/.*Status /, '').slice(0, 500); await shot('w5/W5-44-log');
page.off('response', onG);
return fin({ out });
