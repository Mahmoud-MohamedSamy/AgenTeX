// read-only probe for the not-run cases
const mid = await modId(); const o = {};
const g = async (k, p) => { const r = await api('GET', p); o[k] = r.s + ' ' + JSON.stringify(r.j && r.j.data).slice(0, 500); return r; };
await g('fp', '/modules/' + mid + '/field-permissions');
await g('profiles', '/iam/profiles');
await g('bp', '/modules/' + mid + '/blueprints');
if (APP === 'desk') { await g('depts', '/desk/departments'); }
else { const c = await modId('contacts'); await g('contactsRules', VR(c)); await g('webforms', '/web-forms'); await g('webforms2', '/crm/web-forms'); }
await g('layouts', '/modules/' + mid + '/layouts');
return o;
