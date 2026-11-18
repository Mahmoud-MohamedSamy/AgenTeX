out.t = (await api(page, 'POST', 'tickets/moveToTrash', { ticketIds: ['1499272000000522001', '1499272000000522035'] })).s;
out.c = (await api(page, 'POST', 'contacts/moveToTrash', { contactIds: ['1499272000000517001'] })).s;
await page.waitForTimeout(5000);
const rb = await api(page, 'GET', 'recycleBin?limit=100');
const items = (rb.j && rb.j.data || []).filter(x => ['1499272000000522001', '1499272000000522035', '1499272000000517001'].includes(String(x.id)) || /QA RT22/.test(JSON.stringify(x)));
out.found = items.length; if (items.length) out.purge = (await api(page, 'POST', 'recycleBin/delete', { ids: items.map(x => x.id) })).s;
await page.waitForTimeout(3000);
const rb2 = await api(page, 'GET', 'recycleBin?limit=100'); out.left = (rb2.j && rb2.j.data || []).filter(x => /QA RT22/.test(JSON.stringify(x))).length;
out.get = [(await api(page, 'GET', 'tickets/1499272000000522001')).s, (await api(page, 'GET', 'tickets/1499272000000522035')).s, (await api(page, 'GET', 'contacts/1499272000000517001')).s];
