// Read-only: what of the round-4 Desk test data still exists.
const C = '43004ce2-577f-4eda-b00a-0750fe40c3d4', T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const mods = arr((await api('GET', '/modules')).j?.data).filter(m => /qa.?rt/i.test((m.name || '') + (m.apiName || m.api_name || '')) ).map(m => ({ id: m.id, name: m.name }));
const dts = arr((await api('GET', '/fields/datatypes')).j?.data).filter(d => /qa_rt/i.test(JSON.stringify(d))).map(d => d.key || d.name || d.id);
const recs = {};
for (const [m, ids] of [[C, ['f0de6428', 'c5f64eca', '0c7e7a90']], [T, ['fd913c6d', '6fbde867']]]) {
  const r = await api('GET', `/modules/${m}/records?page=1&per_page=200&sort=-created_at`);
  recs[m === C ? 'contacts' : 'tickets'] = arr(r.j?.data).filter(x => ids.some(p => x.id.startsWith(p))).map(x => x.id);
}
const links = await api('GET', '/desk/integrations/crm/links?limit=200');
return { mods, dts, recs, linkStatus: links.s, links: arr(links.j?.data).filter(l => String(l.id).startsWith('f2e7a3dd')).map(l => l.id) };
