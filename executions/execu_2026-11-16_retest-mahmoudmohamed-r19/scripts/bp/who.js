const r = {}; for (const id of [AG_A, AG_B, A2]) { const u = await api('GET', '/iam/users/' + id); const d = u.j?.data || {}; r[id.slice(0, 8)] = { s: u.s, name: d.display_name || d.name || ((d.first_name || '') + ' ' + (d.last_name || '')), status: d.status, keys: Object.keys(d).filter(k => !/mail|phone/i.test(k)).slice(0, 25) }; }
return r;
