const dm = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out = {};
if (process.env.DEL) { out.del = SR(await delRule(dm, I.g15rule)); return out; }
const ex = (await rules(dm)).filter(r => r.layoutId === 'fcba0068-d67f-44f5-8412-cdef9c09e16e' && r.primaryField === 'stage'); out.existing = ex.length;
const r = await mkRule(dm, { name: P + ' G15 temp', layoutId: 'fcba0068-d67f-44f5-8412-cdef9c09e16e', primaryField: 'stage', branches: [br(eq('stage', 'test-02'), [req(['next_step'])])] }); out.mk = SR(r).slice(0, 300); if (r.j.data) { I.g15rule = r.j.data.id; SAVE(); LED('TEMP Deals Standard rule ' + r.j.data.id + ' (stage test-02, delete right after G15)'); }
return out;
