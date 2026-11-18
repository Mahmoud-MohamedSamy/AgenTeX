const tk = ['1499272000000547001', '1499272000000547047', '1499272000000547093'];
out.t = (await api(page, 'POST', 'tickets/moveToTrash', { ticketIds: tk })).s;
out.c = (await api(page, 'POST', 'contacts/moveToTrash', { contactIds: ['1499272000000517213'] })).s;
await page.waitForTimeout(5000);
const rb = await api(page, 'GET', 'recycleBin?limit=100'); const items = (rb.j && rb.j.data || []).filter(x => tk.includes(String(x.id)) || String(x.id) === '1499272000000517213' || /QA RT22/.test(JSON.stringify(x)));
out.found = items.length; if (items.length) out.purge = (await api(page, 'POST', 'recycleBin/delete', { ids: items.map(x => x.id) })).s;
await page.waitForTimeout(3000); const rb2 = await api(page, 'GET', 'recycleBin?limit=100'); out.binLeft = (rb2.j && rb2.j.data || []).filter(x => /QA RT22/.test(JSON.stringify(x))).length;
