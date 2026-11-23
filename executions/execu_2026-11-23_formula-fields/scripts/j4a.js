for (const p of ['/iam/profiles', '/iam/users?limit=100', '/iam/me/profile', '/iam/users/me']) { const r = await api('GET', p); log(p, r.s, JSON.stringify(r.j?.data).slice(0, 200)); }
