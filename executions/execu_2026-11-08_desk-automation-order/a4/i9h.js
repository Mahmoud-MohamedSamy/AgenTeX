const o = JSON.parse(fs.readFileSync('../a4/i9-out.json'));
const p = await api('POST', `/desk/tickets/${o.manual}/assign`, { owner_id: o.AG }); await sleep(2000);
log({ activeManual: p.s + (p.s >= 300 ? ' ' + p.t.slice(0, 200) : ''), ownerSet: JSON.stringify(await getTicket(o.manual)).includes(o.AG) });
