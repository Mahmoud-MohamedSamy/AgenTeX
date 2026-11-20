const J = JSON.parse(fs.readFileSync(RUN + '/scripts/b2/3065.json', 'utf8')); const o = {};
const r = await api('PATCH', '/modules/' + TK + '/records/' + J.t.V2, { data: fields({ priority: 'High' }) }); o.editV2 = E(r); LED('as CES2 (view-only) edit priority High on ' + J.n.V2 + ' (own ticket) probe: ' + r.s);
const r2 = await api('PATCH', '/modules/' + TK + '/records/' + J.t.V1, { data: fields({ priority: 'High' }) }); o.editV1 = E(r2);
const h = L((await api('GET', `/desk/tickets/${J.t.V2}/history`)).j?.data); o.histV2 = h.map(x => x.occurred_at.slice(11, 19) + ' ' + x.action.replace('ticket.', '') + ' ' + (x.actor?.user_id === AG_A ? 'CES2' : x.actor?.kind));
return o;
