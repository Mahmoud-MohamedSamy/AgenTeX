const mid = await modId(); const out = {}; const F = await fieldsOf(mid); const t = F.find(f => f.fieldName === 'qa_lr_radio');
const body = { ...t, datatypeKey: 'pick_list' }; for (const k of ['id','moduleId','createdAt','createdBy','createdByName','lastModifiedAt','lastModifiedBy','lastModifiedByName','layouts','capabilities']) delete body[k];
const p = await api('PUT', '/modules/' + mid + '/fields/' + t.id, body); out.put = SR(p).slice(0, 300);
const t2 = (await fieldsOf(mid)).find(f => f.fieldName === 'qa_lr_radio'); out.typeNow = t2.datatypeKey;
const conv = await api('POST', '/modules/' + mid + '/fields/' + t.id + '/convert', { datatypeKey: 'pick_list' }); out.convert = SR(conv).slice(0, 200);
out.radioRule = (await rules(mid, '?layoutId=' + I.layout)).filter(r => /radio/.test(r.name)).map(r => r.status + ' ' + JSON.stringify(r.definitionError || null));
return out;
