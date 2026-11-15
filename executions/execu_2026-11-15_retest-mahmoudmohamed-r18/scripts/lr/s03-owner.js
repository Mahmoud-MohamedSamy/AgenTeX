const mid = await modId(); const lid = I.layout; const out = {}; const f = x => FP + x;
const me = (await api('GET', '/iam/me')).j.data; I.meId = me.user_id; SAVE();
const r = await mkRule(mid, { layoutId: lid, name: P + ' owner', primaryField: 'owner', branches: [br(eq('owner', I.meId), [show([f('order')])])] }, 'Leads'); out.mk = SR(r).slice(0, 300); if (r.j && r.j.data) { I.rOwner = r.j.data.id; SAVE(); out.back = JSON.stringify(r.j.data.branches[0].condition); }
const fo = (await fieldsOf(mid)).find(x => x.fieldName === 'owner'); out.ownerType = fo.datatypeKey;
return out;
