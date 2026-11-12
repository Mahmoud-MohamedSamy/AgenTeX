const H = '1475109000000006907', o = { sk: [] };
const crit = n => ({ fieldConditions: [{ fieldName: 'Subject', fieldModule: 'tickets', condition: 'contains', value: [n.replace(/ /g, '')] }], pattern: '1' });
const t = await z('POST', '/skillTypes', { departmentId: DEPT, name: 'QA SK13 T' }); o.t = [t.s, t.j?.id];
for (let i = 1; i <= 12; i++) { const n = 'QA SK13 S' + i; const r = await z('POST', '/skills', { name: n, skillTypeId: t.j.id, status: 'ACTIVE', criteria: crit(n) }); o.sk.push([n, r.s, r.j?.id]); }
const ia = await z('POST', '/skills', { name: 'QA SK13 Inact', skillTypeId: t.j.id, status: 'INACTIVE', criteria: crit('QA SK13 Inact') }); o.sk.push(['QA SK13 Inact', ia.s, ia.j?.id, ia.j?.status]);
const th = await z('POST', '/skillTypes', { departmentId: H, name: 'QA SK13 TH' }); o.th = [th.s, th.j?.id];
const hs = await z('POST', '/skills', { name: 'QA SK13 HS', skillTypeId: th.j.id, status: 'ACTIVE', criteria: crit('QA SK13 HS') }); o.sk.push(['QA SK13 HS', hs.s, hs.j?.id]);
return o;
