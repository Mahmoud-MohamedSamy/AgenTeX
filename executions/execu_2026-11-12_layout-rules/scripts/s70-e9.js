const mid = await modId(); const F = await fieldsOf(mid); const sys = F.filter(f => f.isSystemManaged || /auto_number|created|modified/.test(f.datatypeKey + f.fieldName)).map(f => f.fieldName + ':' + f.datatypeKey + ':onLayout?').slice(0, 8);
const L = await getLayout(mid, I.layout); const onL = L.views.CREATE.layout.sections.flatMap(s => s.columns.flatMap(c => c.fields.map(f => f.fieldName)));
const r = await mkRule(mid, { name: P + ' E9', layoutId: I.layout, primaryField: 'qa_lr_vip', status: 'disabled', branches: [br(eq('qa_lr_vip', true), [req(['auto_number'])])] });
const out = { sys, onL: onL.join(','), mkAuto: SR(r).slice(0, 300) }; if (r.j.data) await delRule(mid, r.j.data.id); return out;
