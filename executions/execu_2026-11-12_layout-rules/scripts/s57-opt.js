const mid = await modId(); const out = {}; const F = await fieldsOf(mid); const t = F.find(f => f.fieldName === 'qa_lr_type'); const vals = process.env.V.split(',');
const body = { ...t, datatypeOptions: { ...t.datatypeOptions, allowed_values: vals } }; for (const k of ['id','moduleId','createdAt','createdBy','createdByName','lastModifiedAt','lastModifiedBy','lastModifiedByName','layouts','capabilities']) delete body[k];
out.put = SR(await api('PUT', '/modules/' + mid + '/fields/' + t.id, body)).slice(0, 300);
out.rules = (await rules(mid, '?layoutId=' + I.layout)).filter(r => /basic/.test(r.name)).map(r => r.status + ' err=' + JSON.stringify(r.definitionError || null));
return out;
