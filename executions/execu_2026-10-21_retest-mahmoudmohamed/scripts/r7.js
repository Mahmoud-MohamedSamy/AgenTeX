const MID = 'c0394292-52a2-446d-a326-06733fe289ba', CONTACTS = '43004ce2-577f-4eda-b00a-0750fe40c3d4';
const rel = await api('GET', `/modules/${CONTACTS}/related-modules`);
const items = arr(rel.j?.data);
const cf = (await fieldsOf(MID)).find(f => f.fieldName === 'qa_rt_cdt');
const lk = (await fieldsOf(MID)).find(f => f.fieldName === 'qa_rt_lk1');
return done({ relCount: items.length, relSample: items.slice(0, 3).map(x => JSON.stringify(x).slice(0, 300)), relHasMID: JSON.stringify(rel.j).includes(MID), relRaw: rel.t.slice(0, 400), cdt: JSON.stringify(cf).slice(0, 700), lk: JSON.stringify(lk.datatypeOptions) });
