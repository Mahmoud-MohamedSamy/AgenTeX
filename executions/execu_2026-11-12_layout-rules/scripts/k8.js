const mid = await modId(); const out = {}; const ord = async () => (await rules(mid, '?layoutId=' + I.layout)).map(x => x.name.replace(P + ' ', '') + ':' + x.sortOrder);
out.before = await ord();
const a = await api('PUT', '/modules/' + mid + '/layout-rules/order', { layoutId: I.layout, ruleIds: [I.b4_disabled, I.b4_active, I.b4_def] }); out.mixed = SR(a).slice(0, 250);
const b = await api('PUT', '/modules/' + mid + '/layout-rules/order', { layoutId: I.layout, ruleIds: [I.b4_def] }); out.onlyForeign = SR(b).slice(0, 250);
const c = await api('PUT', '/modules/' + mid + '/layout-rules/order', { layoutId: I.defLayout, ruleIds: [I.b4_active, I.b4_def] }); out.foreignOnDef = SR(c).slice(0, 250);
out.after = await ord(); out.defRule = (await getRule(mid, I.b4_def)).j.data; out.defRule = out.defRule.layoutId === I.defLayout ? 'still on default layout, sortOrder ' + out.defRule.sortOrder : 'MOVED to ' + out.defRule.layoutId;
const act = (await getRule(mid, I.b4_active)).j.data; out.activeLayout = act.layoutId === I.layout ? 'still QA' : 'MOVED';
return out;
