const tid = 'c4000ace-3bd3-4ecc-b8e5-7a60a7231f41';
const rules = arr((await api('GET','/workflow/rules?moduleId='+T+'&take=200')).j.data);
const hits = []; for (const r of rules) { const e = (await execs(tid, r.id)); if (e.length) hits.push(r.name + (r.isActive?'':' (inactive)') + ': ' + e.map(x => x.triggerKind + ' ' + outcome(x) + ' ' + (x.dispatches||[]).map(d=>d.actionType+':'+d.status).join('+')).join('; ')); }
const withTagA = rules.filter(r => JSON.stringify(r.actions).includes('a41004d3')).map(r => r.name + ' active=' + r.isActive + ' ' + JSON.stringify(r.trigger.kind));
const h = arr((await api('GET', `/desk/tickets/${tid}/history`)).j.data).map(x => x.occurred_at.slice(11,19) + ' ' + x.action + ' ' + x.actor.kind + ' ' + x.source);
return { n: rules.length, hits, withTagA, history: h };
