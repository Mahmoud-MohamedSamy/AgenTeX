// TAVI: own QA department for isolation
const o = {};
const d = await api('POST', '/desk/departments', { name: 'QA SK12 Dept A' }); o.dept = [d.s, d.t.slice(0, 400)];
return o;
