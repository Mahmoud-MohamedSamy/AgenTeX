const id = 'b1eea7f3-e0dc-4ae9-9af0-4c57b393515e'; const out = {};
await sleep(5000);
const g = await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/' + id);
const d = (g.j && g.j.data && g.j.data.data) || []; const o = {}; for (const x of d) if (['subject','priority','status','description','phone','email','ticket_number'].includes(x.field)) o[x.field] = x.value && (x.value.value !== undefined ? x.value.value : JSON.stringify(x.value));
out.record = o;
const ex = await api('GET', '/workflow/executions?recordId=' + id); out.exec = ex.s + ' ' + JSON.stringify(arr(ex.j && ex.j.data).map(e => ({ rule: e.ruleName || e.ruleId, trig: e.triggerKind || e.trigger, status: e.status, at: e.createdAt || e.startedAt }))).slice(0, 2500);
await go('/views/all/tickets/' + id, 9000); await shot('NDC-2205-ticket-after-create');
return done(out);
