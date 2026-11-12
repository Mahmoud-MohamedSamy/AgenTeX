const mid = await modId(); const lid = I.layout; const out = {};
// C20 deep nested condition
const deep = { op:'or', children:[ { op:'and', children:[ eq('qa_lr_type','Other'), { op:'or', children:[ { op:'and', children:[ {op:'gt',field:'qa_lr_amount',value:1}, {op:'lt',field:'qa_lr_amount',value:5} ] }, eq('qa_lr_text','deep') ] } ] }, eq('qa_lr_type','Question') ] };
const c = await mkRule(mid, { name: P+' deep', layoutId: lid, primaryField:'qa_lr_type', status:'disabled', branches:[ br(deep, [show(['qa_lr_order'])]) ] }); out.c20 = SR(c).slice(0,200); if (c.j.data) { I.rdeep = c.j.data.id; SAVE(); }
// H4: basic rule gets Partner -> show vip
const b = (await getRule(mid, I.c1)).j.data; I.c1orig = I.c1orig || b.branches; SAVE();
b.branches = [...I.c1orig, br(eq('qa_lr_type','Partner'), [show(['qa_lr_vip'])])]; out.h4 = SR(await putRule(mid, I.c1, b)).slice(0,200);
// D17 rename Bronze -> Bronze2
const F = await fieldsOf(mid); const t = F.find(f=>f.fieldName==='qa_lr_tier'); I.tierField = t; SAVE();
const body = { ...t, datatypeOptions: { ...t.datatypeOptions, allowed_values: ['Gold','Silver','Bronze2'] } };
for (const k of ['id','moduleId','createdAt','createdBy','createdByName','lastModifiedAt','lastModifiedBy','lastModifiedByName','layouts','capabilities']) delete body[k];
const p = await api('PUT','/modules/'+mid+'/fields/'+t.id, body); out.rename = SR(p).slice(0,400);
const tr = (await getRule(mid, I.r2)).j.data; out.tierRuleAfter = JSON.stringify(tr.branches.map(x=>x.condition)) + ' st=' + tr.status + ' err=' + JSON.stringify(tr.definitionError||null).slice(0,300);
return out;
