const q = '?department_id=' + IDS.DA; const o = {};
const a = await api('POST', '/desk/skill-types' + q, { name: 'QA AR Type' }); o.q = sh(a);
if (a.s >= 300) { const b = await api('POST', '/desk/skill-types', { name: 'QA AR Type', department_id: IDS.DA }); o.body = sh(b); }
const id = (a.j?.data?.id || a.j?.data?.type?.id); if (id) LED('skill type QA AR Type ' + id);
return o;
