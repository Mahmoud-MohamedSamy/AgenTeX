const o = {};
const wf = await z('GET', `/workflows?module=tickets&departmentId=${DEPT}`); o.wf = (wf.j?.data||[]).map(w => [w.id, w.name]);
const sk = await z('GET', `/skills?departmentId=${DEPT}&limit=100`); const id = n => (sk.j.data.find(s => s.name === n)||{}).id;
const c = await z('POST', '/contacts', { lastName: 'QA SK13 Contact', email: 'qa.sk13.contact@example.com' }); o.contact = [c.s, c.j?.id];
const mk = async (subject, skills) => { const r = await z('POST', '/tickets', { subject, departmentId: DEPT, contactId: c.j.id, ...(skills ? { entitySkills: skills } : {}) }); return [r.s, r.j?.id, r.j?.ticketNumber, r.s >= 300 ? r.t.slice(0,300) : '']; };
o.a = await mk('QA SK13 WF1'); o.b = await mk('QA SK13 WF1', [id('QA SK13 S8'), id('QA SK13 S9')]);
return o;
