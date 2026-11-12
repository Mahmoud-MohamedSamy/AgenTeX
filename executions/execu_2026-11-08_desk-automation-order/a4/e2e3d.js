const S = JSON.parse(fs.readFileSync('../a4/e2e134.json')); const out = {};
for (const [k, ids] of [['before', S.e3c.before.ids], ['after', S.e3c.after.ids]]) out[k] = [];
for (const [k, ids] of [['before', S.e3c.before.ids], ['after', S.e3c.after.ids]]) for (const id of ids) { const g = await getTicket(id); const ex = arr2((await api('GET', `/workflow/executions?recordId=${id}`)).j?.data).filter(e => S.e3.rulesIds.includes(e.ruleId)); out[k].push('#' + g.ticket_number + ' ' + g.subject + ' → ' + ex.flatMap(e => (e.dispatches || []).map(d => d.actionType + ':' + d.status + ' ' + (d.target || '').replace(/[\w.+-]+@[\w.-]+/, '<e>') + ' ' + String(d.completedAt || '').slice(11, 19))).join(',')); }
log(JSON.stringify(out, null, 1));
