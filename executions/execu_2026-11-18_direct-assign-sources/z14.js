const r = await api(page, 'GET', 'tickets?limit=5&sortBy=-createdTime'); out.latest = (r.j && r.j.data || []).map(t => t.ticketNumber + ' ' + t.channel + ' ' + t.createdTime);
