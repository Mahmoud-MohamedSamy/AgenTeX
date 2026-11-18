const r = await mk(TM, 'ticket', 'QA AC2 R4c', { subject: 'QA AC2 R4c QAACSLA', department: DEP.MKT, status: 'Open', priority: 'medium', description: 'QA AC2 QAACSLA', email: 'qa-ac2-c@example.com', channel: 'phone', owner: US.B }); out.id = r.id || r.err;
await sleep(10000); out.sla = (await api('GET', '/desk/tickets/' + r.id + '/sla')).t.slice(0, 400);
return fin({ out });
