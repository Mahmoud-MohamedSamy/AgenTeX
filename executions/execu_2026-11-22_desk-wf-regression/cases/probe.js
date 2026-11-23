const rid='cb7e6344-f00a-40b2-a5be-56ff42cbf8ac';
await api('PATCH','/workflow/rules/'+rid,{actions:[{order:0,delaySeconds:0,type:'FieldUpdate',fieldUpdates:{priority:S('high')}}]});
const t = await mkTicket('TR01');
const got = await waitTicket(t.id, x => x.priority === 'high', 45);
const e = await execs(t.id);
return { ticket: t.id, priority: got ? got.priority : (await getTicket(t.id)).priority, execs: e.map(x => JSON.stringify(x).slice(0,500)) };
