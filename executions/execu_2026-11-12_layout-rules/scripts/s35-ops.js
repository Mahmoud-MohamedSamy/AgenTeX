const mid = await modId(); const lid = I.layout; const out = {};
const F = await fieldsOf(mid); for (const n of ['qa_lr_radio','qa_lr_type','qa_lr_tier','qa_lr_tags','qa_lr_filter']) { const f = F.find(x=>x.fieldName===n); out[n] = f.datatypeKey + ' ' + JSON.stringify(f.datatypeOptions).slice(0,200); }
const R = x => ({ op:'and', children:[ eq('qa_lr_radio','No'), x ] });
const tries = { regexA: { op:'regexMatches', field:'qa_lr_text', value:'^[0-9]{3}$' }, regexB: { op:'regexMatches', field:'qa_lr_text', pattern:'^[0-9]{3}$' }, lenA: { op:'lengthGt', field:'qa_lr_text', value:20 }, nul: { op:'isNull', field:'qa_lr_email2' }, emp: { op:'isEmpty', field:'qa_lr_email2' }, dt: { op:'gt', field:'qa_lr_date', value:'2026-01-01' } };
for (const [k,c] of Object.entries(tries)) { const r = await mkRule(mid, { name: P+' op '+k, layoutId: lid, primaryField:'qa_lr_radio', status:'disabled', branches:[ br(R(c), [show(['qa_lr_reason'])]) ] }); out[k] = SR(r).slice(0,250); if (r.j && r.j.data) { const g = (await getRule(mid, r.j.data.id)).j.data; out[k+'_back'] = JSON.stringify(g.branches[0].condition.children[1]); await delRule(mid, r.j.data.id); } }
return out;
