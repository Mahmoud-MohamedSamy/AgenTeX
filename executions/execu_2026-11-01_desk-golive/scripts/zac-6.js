const TE = '1499272000000006907'; out.r = [];
for (const [id, types] of [['1499272000000451682', ['READ_ONLY']], ['1499272000000451721', ['RESTRICTED_ACCESS', 'RESTRICTED', 'LIMITED']]]) for (const t of types) { const r = await api(page, 'PATCH', 'tickets/' + id, { sharedDepartments: [{ id: TE, type: t }] }); out.r.push(id.slice(-4) + ' ' + t + ' ' + r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 200) : JSON.stringify(r.j.sharedDepartments))); if (r.s < 300) break; }
// 11+ limit / own dept
const r2 = await api(page, 'PATCH', 'tickets/1499272000000451850', { sharedDepartments: [{ id: '1499272000000432293', type: 'READ_ONLY' }] }); out.own = r2.s + ' ' + r2.t.slice(0, 200);
