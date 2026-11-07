const o = {}; const re = /QA RT1[12]/;
const mods = arr((await api('o', 'GET', '/modules')).j?.data); const M = {}; for (const m of mods) M[m.apiName || m.api_name || m.key] = m.id; o.mods = Object.fromEntries(Object.entries(M).filter(([k]) => /lead|deal|transact|task|contact|customer/i.test(k)));
for (const k of Object.keys(o.mods)) {
  const id = M[k]; const v = await api('o', 'GET', `/modules/${id}/views`); o['views_' + k] = { s: v.s, qa: arr(v.j?.data).filter(x => re.test(x.name)).map(x => x.name + '|' + x.id) };
  const f = JSON.stringify([]); const r = await api('o', 'GET', `/modules/${id}/records?page=1&per_page=200&search=${encodeURIComponent('QA RT1')}`); o['rec_' + k] = { s: r.s, total: r.j?.meta?.total_count };
}
for (const p of ['/iam/invitations', '/iam/tenant/invitations', '/iam/users/invitations', '/iam/users?status=invited']) { const r = await api('o', 'GET', p); o['inv ' + p] = r.s + ' ' + (r.s < 300 ? JSON.stringify(r.j).match(/qa\.rt1[12][^"]*/gi) : ''); }
return o;
