const r = await api('PUT', '/desk/ticket-access/settings', { record_visibility: 'zzz', public_scope: 'departments', peer_sharing_role_ids: [] }); out.bad = r.s + ' ' + r.t.slice(0, 500);
out.cur = (await api('GET', '/desk/ticket-access/settings')).t.slice(0, 200);
return fin({ out });
