const mid = await modId(); const lid = I.layout; const out = {};
const F = await fieldsOf(mid); const t = F.find(f=>f.fieldName==='qa_lr_tier');
const body = { ...t, datatypeOptions: { ...t.datatypeOptions, allowed_values: ['Gold','Silver','Bronze'] } };
for (const k of ['id','moduleId','createdAt','createdBy','createdByName','lastModifiedAt','lastModifiedBy','lastModifiedByName','layouts','capabilities']) delete body[k];
out.renameBack = SR(await api('PUT','/modules/'+mid+'/fields/'+t.id, body)).slice(0,200);
const tr = (await getRule(mid, I.r2)).j.data; out.tierErr = tr.definitionError || null; I.r2orig = I.r2orig || tr.branches; SAVE();
// H5 loop: tier Silver -> set filter Y ; filter Y -> set tier Gold ; tier Gold -> set filter Z ; filter Z -> set tier Silver
tr.branches = [...I.r2orig, br(eq('qa_lr_tier','Silver'), [{type:'set_value',field:'qa_lr_filter',value:'Y'}]), br(eq('qa_lr_tier','Gold'), [{type:'set_value',field:'qa_lr_filter',value:'Z'}])];
out.tier = SR(await putRule(mid, I.r2, tr)).slice(0,300);
const ca = (await getRule(mid, I.rF)).j.data; I.rForig = I.rForig || ca.branches; SAVE();
ca.branches = [...I.rForig, br(eq('qa_lr_filter','Z'), [{type:'set_value',field:'qa_lr_tier',value:'Silver'}])];
// Y branch: add set tier Gold
ca.branches[1] = { ...ca.branches[1], actions: [...ca.branches[1].actions, {type:'set_value',field:'qa_lr_tier',value:'Gold'}] };
out.ca = SR(await putRule(mid, I.rF, ca)).slice(0,300);
return out;
