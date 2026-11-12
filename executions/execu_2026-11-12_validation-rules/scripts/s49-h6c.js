const mid = await modId(); const o = {};
const L0 = arr((await api('GET', '/modules/' + mid + '/field-permissions')).j.data).filter(x => x.fieldId === I.fields.qa_vr_note);
for (const x of L0) o['fp ' + x.permission] = (await api('DELETE', '/modules/' + mid + '/field-permissions/' + x.id)).s;
o.rule = I.h6 && (await delRule(mid, I.h6)).s; delete I.h6; SAVE(); LED('H6/H7 field permission + rule removed');
return o;
