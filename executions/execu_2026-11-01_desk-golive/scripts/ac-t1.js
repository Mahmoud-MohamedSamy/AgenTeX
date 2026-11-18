const r = await api('PUT', '/desk/teams/' + TEAM, { name: 'QA AC Team', description: 'access run 17 Nov, delete after', department_id: DEP.CS, sources: [{ kind: 'agent', ref_id: US.E }], color: 'blue', icon: 'star' }); out.put = r.s + ' ' + r.t.slice(0, 150);
const f = flat(D((await api('GET', '/modules/' + TM + '/records/' + TK.CST)).j)); out.cst = [f.team, f.owner, f.department].join(' | ');
// contact id for C checks
const c = flat(D((await api('GET', '/modules/' + TM + '/records/' + TK.CSD)).j)); out.contact = c.contact_id;
return fin({ out });
