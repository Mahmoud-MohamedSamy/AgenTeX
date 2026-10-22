const MID = 'd08b353d-3634-4290-8785-fc6b6ecec00f', lid = '6d39b5d2-bafc-40a0-bfc9-64255323ca10';
const F = await fieldsOf(MID);
const after = await getLayout(MID, lid);
const cnt = v => (after.views[v]?.layout?.sections || []).flatMap(s => s.columns.flatMap(c => c.fields)).length;
return done({ fields: F.length, custom: F.filter(f => /^qa_rt_f/.test(f.fieldName)).length, CREATE: cnt('CREATE'), DETAIL: cnt('DETAIL'), mod: after.lastModifiedAt || after.updatedAt });
