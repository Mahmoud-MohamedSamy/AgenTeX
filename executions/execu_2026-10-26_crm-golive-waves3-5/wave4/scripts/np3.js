const r = await call('GET', '/iam/me/profile'); const p = await call('GET', '/iam/me/permissions');
return { profile: r.j.profile, org: r.j.org_unit || r.j.org_unit_id, perms: (p.j.data || []).filter(x => /notif/i.test(x)) , nperms: (p.j.data || []).length };
