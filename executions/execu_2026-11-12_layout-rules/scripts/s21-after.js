const mid = await modId(); const lid = I.layout; const out = {};
// B7 reorder API
const before = (await rules(mid, '?layoutId=' + lid)).filter(r => r.name.startsWith(P)).map(r => ({ id: r.id, n: r.name }));
const rev = before.map(r => r.id).reverse(); const ro = await api('PUT', '/modules/' + mid + '/layout-rules/order', { layoutId: lid, ruleIds: rev });
const after = (await rules(mid, '?layoutId=' + lid)).filter(r => r.name.startsWith(P)).map(r => r.name);
out.B7 = ro.s + ' order before ' + before.map(r => r.n.replace(P + ' ', '')).join('>') + ' after ' + after.map(n => n.replace(P + ' ', '')).join('>');
await api('PUT', '/modules/' + mid + '/layout-rules/order', { layoutId: lid, ruleIds: before.map(r => r.id) });
// K8 reorder with a foreign id
const other = (await rules(mid)).find(r => r.layoutId !== lid); if (other) { const k8 = await api('PUT', '/modules/' + mid + '/layout-rules/order', { layoutId: lid, ruleIds: [other.id, ...before.map(r => r.id)] }); out.K8 = SR(k8).slice(0, 200); }
// J4: temp field as target, then delete the field
const tf = await api('POST', '/modules/' + mid + '/fields', { fields: [{ fieldName: 'qa_lr_tmp', datatypeKey: 'single_line', labels: { en: P + ' tmp' }, datatypeOptions: {}, required: false, unique: false, uniquePeerModuleIds: [] }] });
const F = await fieldsOf(mid); const tmp = F.find(f => f.fieldName === 'qa_lr_tmp');
// place on layout CREATE/DETAIL sec A
const lay = await getLayout(mid, lid); for (const v of Object.values(lay.views)) { const s = v.layout.sections.find(x => x.id === 'sec-qa-lr-a'); if (s && !s.columns[0].fields.some(f => f.fieldName === 'qa_lr_tmp')) s.columns[0].fields.push(JSON.parse(JSON.stringify(tmp))); }
const b = { ...lay }; delete b.id; const pl = await api('PUT', '/modules/' + mid + '/layouts/' + lid, b); out.placeTmp = pl.s;
const tr = await mkRule(mid, { name: P + ' tmp target', layoutId: lid, primaryField: 'qa_lr_radio' in {} ? 'x' : (APP === 'crm' ? 'qa_lr_radio' : 'qa_lr_filter'), branches: [br(eq(APP === 'crm' ? 'qa_lr_radio' : 'qa_lr_filter', APP === 'crm' ? 'No' : 'Z'), [show(['qa_lr_tmp'])])] });
out.tmpRule = SR(tr).slice(0, 160);
// if radio rule exists on CRM (r4 uses radio) - fallback to disabled status
if (tr.s >= 300) { const tr2 = await mkRule(mid, { name: P + ' tmp target', layoutId: lid, status: 'disabled', primaryField: 'qa_lr_type', branches: [br(eq('qa_lr_type', 'Other'), [show(['qa_lr_tmp'])])] }); out.tmpRule2 = SR(tr2).slice(0, 120); I.tmpRule = tr2.j?.data?.id; } else I.tmpRule = tr.j?.data?.id; SAVE();
const usage = await api('GET', '/modules/' + mid + '/rule-usage?field=qa_lr_tmp'); out.J1_usage = usage.s + ' ' + (usage.t || '').slice(0, 200);
const del = await api('DELETE', '/modules/' + mid + '/fields/' + tmp.id); out.J4_delete = SR(del).slice(0, 300);
const rg = await getRule(mid, I.tmpRule); out.J4_rule_after = rg.s + ' definitionError=' + JSON.stringify(rg.j?.data?.definitionError) + ' warnings=' + JSON.stringify(rg.j?.data?.warnings);
// J2: remove primary field (qa_lr_vip) from the layout, read rule definitionError, put back
const lay2 = await getLayout(mid, lid); const keep = JSON.parse(JSON.stringify(lay2));
for (const v of Object.values(lay2.views)) for (const s of v.layout.sections) for (const c of s.columns) c.fields = c.fields.filter(f => f.fieldName !== 'qa_lr_vip');
const b2 = { ...lay2 }; delete b2.id; const rm = await api('PUT', '/modules/' + mid + '/layouts/' + lid, b2); out.J2_remove = SR(rm).slice(0, 300);
const vr = await getRule(mid, I.r3); out.J2_rule = 'definitionError=' + JSON.stringify(vr.j?.data?.definitionError);
const lay3 = await getLayout(mid, lid); for (const [k, v] of Object.entries(lay3.views)) v.layout = keep.views[k].layout; const b3 = { ...lay3 }; delete b3.id; out.J2_restore = (await api('PUT', '/modules/' + mid + '/layouts/' + lid, b3)).s;
out.J2_rule_after_restore = 'definitionError=' + JSON.stringify((await getRule(mid, I.r3)).j?.data?.definitionError);
// I10 audit
for (const p of ['/audit/logs?entity_type=layout_rule&limit=5', '/audit-log?entityType=layout_rule&limit=5', '/audit/events?entity=layout_rule&limit=5']) { const a = await api('GET', p); out['I10 ' + p] = a.s + ' ' + (a.t || '').replace(/"[0-9a-f-]{36}"/g, '"<id>"').slice(0, 300); }
return out;
