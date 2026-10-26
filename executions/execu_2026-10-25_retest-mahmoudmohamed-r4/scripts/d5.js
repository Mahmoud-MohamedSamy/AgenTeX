const ID = '01727195-e2d5-41c5-821b-a30d5a965976';
const add = await api('POST', `/modules/${ID}/fields`, { fields: [{ fieldName: 'qa_rt_cdt', labels: { en: 'QA RT cdt' }, datatypeKey: 'qa_rt_dt4', required: false, unique: false, uniquePeerModuleIds: [] }] });
const f = arr((await api('GET', `/modules/${ID}/fields`)).j?.data).find(x => x.fieldName === 'qa_rt_cdt');
const del = await api('DELETE', '/custom-datatypes/qa_rt_dt4');
return done({ add: add.s + ' ' + (add.s >= 300 ? add.t.slice(0, 200) : ''), stored: f && { datatypeKey: f.datatypeKey, opts: JSON.stringify(f.datatypeOptions || {}).slice(0, 150), custom: JSON.stringify(f).match(/"custom[^,]*/g) }, deleteTypeInUse: del.s + ' ' + del.t.slice(0, 200) });
