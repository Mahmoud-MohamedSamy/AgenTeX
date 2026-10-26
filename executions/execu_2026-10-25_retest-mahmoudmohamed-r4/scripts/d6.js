const ID = '01727195-e2d5-41c5-821b-a30d5a965976'; const out = {};
const add = await api('POST', `/modules/${ID}/fields`, { fields: [{ fieldName: 'qa_rt_file', labels: { en: 'QA RT file' }, datatypeKey: 'file_upload', datatypeOptions: { allowed_extensions: ['pdf'], max_size_mb: 1 }, required: false, unique: false, uniquePeerModuleIds: [] }, { fieldName: 'qa_rt_img', labels: { en: 'QA RT img' }, datatypeKey: 'image_upload', datatypeOptions: { allowed_extensions: ['png'], max_size_mb: 1 }, required: false, unique: false, uniquePeerModuleIds: [] }] });
out.add = add.s + ' ' + (add.s >= 300 ? add.t.slice(0, 200) : '');
const fs = arr((await api('GET', `/modules/${ID}/fields`)).j?.data); const F = fs.filter(f => /^qa_rt_(file|img)$/.test(f.fieldName)); out.opts = F.map(f => f.fieldName + ' ' + JSON.stringify(f.datatypeOptions));
const lays = arr((await api('GET', `/modules/${ID}/layouts`)).j?.data); const lay = (await api('GET', `/modules/${ID}/layouts/${lays[0].id}`)).j.data; out.layout = lays[0].id + ' ' + lays[0].name;
let placed = 0; for (const v of ['CREATE', 'QUICK_CREATE', 'DETAIL']) { const ss = lay.views?.[v]?.layout?.sections; if (!ss || !ss[0]) continue; const col = ss[0].columns[ss[0].columns.length - 1]; for (const f of F) if (!ss.some(s => s.columns.some(c => c.fields.some(e => e.id === f.id)))) { col.fields.push(JSON.parse(JSON.stringify(f))); placed++; } }
const b = { ...lay }; delete b.id; out.place = (await api('PUT', `/modules/${ID}/layouts/${lays[0].id}`, b)).s + ' placed ' + placed;
return done(out);
