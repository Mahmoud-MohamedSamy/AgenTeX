const o = {};
const W = '1475109000000570858';
let w = await z('DELETE', '/workflows/' + W); o.wf = [w.s, w.t.slice(0, 200)];
const wl = await z('GET', '/workflows?module=tickets&departmentId=' + DEPT); o.wfLeft = (wl.j?.data || []).map(x => [x.id, x.name]);
const tickets = ['1475109000000570924', '1475109000000570973', '1475109000000579027'];
const t = await z('POST', '/tickets/moveToTrash', { ticketIds: tickets }); o.tickets = [t.s, t.t.slice(0, 200)];
const c = await z('POST', '/contacts/moveToTrash', { contactIds: ['1475109000000570887'] }); o.contact = [c.s, c.t.slice(0, 200)];
const skills = ['570714','570724','570734','570744','570754','570764','570774','570784','570794','570804','570814','570824','570834','570847'].map(s => '1475109000000' + s);
o.skillFail = []; let ok = 0;
for (const id of skills) { const r = await z('DELETE', '/skills/' + id); if (r.s === 204 || r.s === 200 || r.s === 404) ok++; else o.skillFail.push([id, r.s, r.t.slice(0, 150)]); }
o.skillsDeleted = ok;
for (const id of ['1475109000000570711', '1475109000000570844']) { const r = await z('DELETE', '/skillTypes/' + id); o['type' + id.slice(-6)] = [r.s, r.t.slice(0, 150)]; }
return o;
