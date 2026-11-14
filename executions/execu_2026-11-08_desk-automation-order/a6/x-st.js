const r = await api('GET', '/desk/ticket-statuses'); log(r.s, JSON.stringify(r.j).slice(0, 400));
