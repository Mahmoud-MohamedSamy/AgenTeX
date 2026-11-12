const dm = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out = {};
const r = await mkRule(dm, { name: P + ' deals X4', layoutId: I.dealLayout, primaryField: 'stage', branches: [br({ op: 'and', children: [eq('stage', 'negotiation'), { op: 'gt', field: 'discount', value: 20 }] }, [show(['qa_lr_appnote']), req(['qa_lr_appnote']), { type: 'set_value', field: 'probability', value: 10 }, { type: 'read_only_fields', fields: ['amount'], exceptProfileIds: ['11111111-1111-1111-1111-111111111103'] }])] });
out.rule = SR(r).slice(0, 400); if (r.j.data) { I.dealRule = r.j.data.id; SAVE(); LED('Deals rule ' + r.j.data.id); }
const rec = await mkRec(dm, { deal_name: P + ' deal G9', stage: 'qualification', discount: 30, amount: 1000 }, I.dealLayout); out.rec = rec.s + ' ' + rec.id + ' ' + rec.err; if (rec.id) { I.dealRec = rec.id; SAVE(); LED('Deal record ' + rec.id); }
return out;
