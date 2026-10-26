const f = await call('GET', '/audit/recycle-bin/facets');
const users = await call('GET', '/iam/users?limit=200');
return { modules: (f.j.data.modules || []).filter(m => /workflow|accounts|leads|contacts/.test(m.module_key)), deletedBy: (f.j.data.deleted_by || f.j.data.users || []).length, keys: Object.keys(f.j.data), nUsers: (users.j.data || []).length };
