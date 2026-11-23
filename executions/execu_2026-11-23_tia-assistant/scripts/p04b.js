const uid = '9d182dfa-05f3-4af7-9685-8615a2fbe537';
const a = await api('GET', '/desk/agents/' + uid);
const d = a.j?.data || {};
return { s: a.s, keys: Object.keys(d), deps: JSON.stringify(d.departments || d.department_ids || d.departmentIds || '').slice(0, 600), role: JSON.stringify(d.role || d.org_unit || d.orgUnit || '').slice(0, 200) };
