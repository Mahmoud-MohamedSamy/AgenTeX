const M2 = '9ef906c2-bdbd-4765-a600-3c724801cc71';
const p = await api('PUT', `/modules/${M2}/permissions`, { profileIds: ['44444444-4444-4444-4444-444444444402'] });
const r = await api('POST', `/modules/${M2}/records`, { data: [{ field: 'name', value: enc('QA RT closed rec (admin)') }] });
return done({ put: p.s, acl: (await api('GET', `/modules/${M2}/acl`)).j.data.rows.map(r => r.principal_kind + ':' + r.principal_id.slice(0, 8) + ':' + r.access_level), rec: r.s });
