const S = JSON.parse(fs.readFileSync(RUN + '/out/lay-ids.json', 'utf8')); const L = M.leads; const ADMIN = '11111111-1111-1111-1111-111111111105'; const o = {};
const g = (await api('GET', `/modules/${L}/layouts/${S.layout}`)).j?.data;
const tries = [{ name: g.name, views: g.views, assignedProfiles: [ADMIN], rowVersion: g.rowVersion }, { assignedProfiles: [ADMIN], rowVersion: g.rowVersion }];
for (const [i, b] of tries.entries()) { const r = await api('PUT', `/modules/${L}/layouts/${S.layout}`, b); const n = (await api('GET', `/modules/${L}/layouts/${S.layout}`)).j?.data; o['t' + i] = { s: r.s, prof: n?.assignedProfiles, err: r.s >= 300 ? r.t.slice(0, 260) : undefined }; if (r.s < 300) break; b.rowVersion = n?.rowVersion; }
if (!Object.values(o).some(x => x.s < 300)) { const r = await api('POST', `/modules/${L}/layouts/assignments`, { layoutId: S.layout, profileId: ADMIN, view: 'DETAIL', isDefault: false }); o.assign = { s: r.s, id: r.j?.data?.id, err: r.s >= 300 ? r.t.slice(0, 200) : undefined }; if (r.j?.data?.id) { S.assignId = r.j.data.id; fs.writeFileSync(RUN + '/out/lay-ids.json', JSON.stringify(S, null, 1)); } }
return o;
