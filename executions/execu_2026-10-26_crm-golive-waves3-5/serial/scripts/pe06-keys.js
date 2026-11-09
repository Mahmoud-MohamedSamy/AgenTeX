const out = {};
for (const p of ['/iam/permissions?limit=1000', '/iam/permissions', '/iam/permission-definitions', '/iam/permissions/catalog']) { const r = await call('GET', p); if (r.s === 200) { const d = r.j.data; const arr = Array.isArray(d) ? d : (d.items || d.permissions || []); out[p] = arr.map(x => x.key || x.permissionKey || x.permission_key).filter(k => /^iam\.(profile|permission)/.test(k || '')); break; } else out[p] = r.s; }
return out;
