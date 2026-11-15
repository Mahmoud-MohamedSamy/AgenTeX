const mid = await modId(); const o = {};
for (const x of arr((await api('GET', '/modules/' + mid + '/field-permissions')).j.data).filter(x => x.fieldId === I.fields.qa_rt18v_note)) o['del ' + x.permission] = (await api('DELETE', '/modules/' + mid + '/field-permissions/' + x.id)).s;
LED('restored: field permissions on qa_rt18v_note for profile User deleted ' + JSON.stringify(o) + ' (back to default, none)');
const h = (await getRule(mid, I.rH6)).j.data; o.h6off = (await putRule(mid, I.rH6, { ...h, status: 'disabled' })).s; LED('changed validation rule QA RT18 H6 note required -> disabled (Leads)');
o.left = arr((await api('GET', '/modules/' + mid + '/field-permissions')).j.data).filter(x => /qa_rt18/.test(x.fieldName || '')).length;
return o;
