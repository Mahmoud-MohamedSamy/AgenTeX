const ids = ['1475109000000570924', '1475109000000570973', '1475109000000579027', '1475109000000570887'];
const o = {};
const before = await z('GET', '/recycleBin?limit=50'); o.inBin = (before.j?.data || []).filter(x => ids.includes(x.id)).map(x => [x.id, x.displayName]);
if (o.inBin.length === ids.length) { const r = await z('POST', '/recycleBin/delete', { ids }); o.purge = [r.s, r.t.slice(0, 200)]; } else o.purge = 'skipped: not all 4 found by exact id';
const after = await z('GET', '/recycleBin?limit=50'); o.left = (after.j?.data || []).filter(x => ids.includes(x.id)).length;
const sk = await z('GET', '/skills?departmentId=' + DEPT + '&limit=100'); o.techSkills = (sk.j?.data || []).map(s => s.name);
const ty = await z('GET', '/skillTypes?departmentId=' + DEPT + '&limit=100'); o.techTypes = (ty.j?.data || []).map(s => s.name);
const tk = await z('GET', '/tickets/search?subject=QA SK13*&limit=50'); o.ticketSearch = [tk.s, (tk.j?.data || []).map(x => x.ticketNumber)];
return o;
