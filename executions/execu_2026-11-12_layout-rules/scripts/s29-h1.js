const mid = await modId(); const g = (await getRule(mid, I.r2)).j.data; const b = JSON.parse(JSON.stringify(g.branches)); b[0].actions.push(show(['qa_lr_order']));
const u = await putRule(mid, I.r2, { ...g, branches: b }); const ord = arg => api('PUT', '/modules/' + mid + '/layout-rules/order', { layoutId: I.layout, ruleIds: arg });
const all = (await rules(mid, '?layoutId=' + I.layout)).map(r => r.id);
if (process.env.REV) { const o = await ord([I.r2, ...all.filter(x => x !== I.r2)]); return 'tier first ' + o.s; }
return 'tier Gold -> show order added ' + u.s;
