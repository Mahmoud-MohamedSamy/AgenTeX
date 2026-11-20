await page.waitForTimeout(6000);
const l = await api(page, 'GET', 'tickets?limit=3&sortBy=-createdTime'); const t = (l.j && l.j.data || [])[0] || {};
out.list = { status: t.status, statusType: t.statusType, keys: Object.keys(t).filter(k => /status/i.test(k)) };
const g = await api(page, 'GET', 'tickets/' + t.id); out.single = { status: g.j && g.j.status, statusType: g.j && g.j.statusType, keys: Object.keys(g.j || {}).filter(k => /status/i.test(k)) };
const s = await api(page, 'GET', 'ticketStatus?departmentId=1499272000000006907'); out.statusList = s.s + ' ' + s.t.slice(0, 400);
const v = await api(page, 'GET', 'tickets/search?statusType=Open&limit=2'); out.searchByType = v.s;
