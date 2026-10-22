const id = '6efdaee1-c891-4b6e-bc97-8db54f607138'; const out = {};
for (const [m, u, b] of [['PATCH', `/teamspaces/${id}/access-mode`, { accessMode: 'selected' }], ['PATCH', `/teamspaces/${id}/access-mode`, { access_mode: 'selected' }], ['PATCH', `/teamspaces/${id}/access-mode`, { mode: 'selected' }], ['PUT', `/teamspaces/${id}/access-mode`, { accessMode: 'selected' }], ['PATCH', `/teamspaces/${id}`, { accessMode: 'selected' }]]) {
  const r = await api(m, u, b); out[m + ' ' + u.split(id)[1] + ' ' + Object.keys(b)[0]] = r.s + ' ' + r.t.slice(0, 160);
  const now = (await api('GET', `/teamspaces/${id}`)).j?.data?.accessMode; if (now !== 'all_users') { out.now = now; break; } }
return out;
