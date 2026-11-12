const s = JSON.parse(fs.readFileSync('../a4/i29.json')), c = JSON.parse(fs.readFileSync('../a4/i29c.json')), f = JSON.parse(fs.readFileSync('../a4/i29f.json'));
for (const id of [s.ticket, c.ctrl]) { const g = await getTicket(id); const e = await execs(id); log(g.ticket_number, g.priority, g.status, JSON.stringify(e.slice(-3))); }
const r = arr2((await api('GET', '/workflow/rules?take=500')).j?.data).find(x => x.id === f.rule); log('rule', r && r.isActive, r && JSON.stringify(r.trigger || r.triggerConfig));
