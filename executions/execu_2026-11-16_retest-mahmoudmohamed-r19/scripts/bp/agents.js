const r = await api('GET', '/iam/users?app_key=desk&page_size=500&page=1'); const Lx = L(r.j?.data);
return Lx.map(x => [String(x.userId).slice(0, 8), x.displayName, x.status, JSON.stringify(x.profileNames), x.isOwner ? 'OWNER' : ''].join(' | '));
