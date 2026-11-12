const o = {};
const t1 = await z('POST', '/skillTypes', { departmentId: DEPT, name: 'QA SK12 T1' }); o.t1 = [t1.s, t1.j?.id || t1.t];
const T = t1.j?.id;
const mk = (name, extra={}) => z('POST', '/skills', { departmentId: DEPT, name, skillTypeId: T, status: 'ACTIVE', criteria: { fieldConditions: [{ fieldName: 'Subject', fieldModule: 'tickets', condition: 'contains', value: [name.replace(/ /g,'')] }], pattern: '1' }, ...extra });
for (const n of ['QA SK12 S1','QA SK12 S2','QA SK12 S3']) { const r = await mk(n); o[n] = [r.s, r.j?.id || r.t.slice(0,300)]; }
// negatives
o.noType = await z('POST','/skills',{ departmentId: DEPT, name: 'QA SK12 NoType', status:'ACTIVE' }); o.noType = [o.noType.s, o.noType.t.slice(0,300)];
o.dup = await mk('QA SK12 S1'); o.dup = [o.dup.s, o.dup.t.slice(0,300), o.dup.j?.id];
o.long = await mk('QA SK12 ' + 'L'.repeat(120)); o.long = [o.long.s, o.long.t.slice(0,300), o.long.j?.id];
o.blank = await z('POST','/skills',{ departmentId: DEPT, name: '', skillTypeId: T, status:'ACTIVE' }); o.blank=[o.blank.s,o.blank.t.slice(0,200)];
o.noCrit = await z('POST','/skills',{ departmentId: DEPT, name: 'QA SK12 NoCrit', skillTypeId: T, status:'ACTIVE' }); o.noCrit=[o.noCrit.s,o.noCrit.t.slice(0,300), o.noCrit.j?.id];
o.html = await mk('QA SK12 <b>x</b>'); o.html=[o.html.s,o.html.t.slice(0,200),o.html.j?.id, o.html.j?.name];
o.dupType = await z('POST','/skillTypes',{ departmentId: DEPT, name: 'QA SK12 T1' }); o.dupType=[o.dupType.s,o.dupType.t.slice(0,200),o.dupType.j?.id];
return o;
