const res = {};
for (const p of ['/iam/me/permissions', '/iam/me/effective-permissions', '/iam/permissions/me', '/iam/me']) { const r = await call('GET', p); res[p] = r.s; if (r.s === 200) res[p + ' body'] = r.t.slice(0, 3500); }
return res;
