const o = {}; const mk = async (n) => { const r = await mkRec(T, { subject: 'QA GL W2 ' + n, status: 'Open', department: DQ, contact_id: 'de7195a2-369e-48c5-b03f-b8e37d6c5fb2', channel: 'Phone', description: 'Go-live wave 2 test ticket (12 Nov). Safe to delete.' }, n); return r.id; };
o.unassigned = await mk('r mkt unassigned'); o.ownerA = await mk('r mkt owner A');
o.assignA = sh(await api('POST', `/desk/tickets/${o.ownerA}/assign`, { owner_id: ME }));
for (const k of ['unassigned', 'ownerA']) { const g = await api('GET', '/desk/tickets/' + o[k]); o['own ' + k] = g.j && g.j.data && [g.j.data.ticket_number, g.j.data.owner_id && g.j.data.owner_id.slice(0, 8)]; }
return fin(o);
