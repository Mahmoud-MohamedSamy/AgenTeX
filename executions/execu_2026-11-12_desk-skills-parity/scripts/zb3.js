const o = {}; const T = '1475109000000529136';
const mk = (name, extra={}) => z('POST', `/skills`, { name, skillTypeId: T, status: 'ACTIVE', criteria: { fieldConditions: [{ fieldName: 'Subject', fieldModule: 'tickets', condition: 'contains', value: [name.replace(/ /g,'')] }], pattern: '1' }, ...extra });
o.ids = {};
for (const n of ['QA SK12 S1','QA SK12 S2','QA SK12 S3']) { const r = await mk(n); o.ids[n] = [r.s, r.j?.id || r.t.slice(0,400)]; }
o.noType = await z('POST',`/skills`,{ name: 'QA SK12 NoType', status:'ACTIVE' }); o.noType = [o.noType.s, o.noType.t.slice(0,300), o.noType.j?.id];
o.dup = await mk('QA SK12 S1'); o.dup = [o.dup.s, o.dup.t.slice(0,300), o.dup.j?.id];
o.dupCase = await mk('qa sk12 s1'); o.dupCase = [o.dupCase.s, o.dupCase.t.slice(0,300), o.dupCase.j?.id];
o.len50 = await mk('QA SK12 ' + 'L'.repeat(42)); o.len50 = [o.len50.s, o.len50.j?.id || o.len50.t.slice(0,300)];
o.blank = await z('POST',`/skills`,{ name: '', skillTypeId: T, status:'ACTIVE' }); o.blank=[o.blank.s,o.blank.t.slice(0,300)];
o.noCrit = await z('POST',`/skills`,{ name: 'QA SK12 NoCrit', skillTypeId: T, status:'ACTIVE' }); o.noCrit=[o.noCrit.s,o.noCrit.j?.id||o.noCrit.t.slice(0,300)];
o.html = await mk('QA SK12 <b>x</b>'); o.html=[o.html.s,o.html.t.slice(0,400)];
o.inactive = await mk('QA SK12 Inact', { status: 'INACTIVE' }); o.inactive=[o.inactive.s,o.inactive.j?.id||o.inactive.t.slice(0,300)];
return o;
