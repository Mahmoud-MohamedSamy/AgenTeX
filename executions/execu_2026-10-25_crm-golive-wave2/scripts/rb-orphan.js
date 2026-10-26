const d = await call('POST', '/audit/recycle-bin/delete', { ids: ['e4d7c527-fe60-47f5-a600-5394e440e13f'] });
const r = await call('POST', '/audit/recycle-bin/restore', { ids: ['e4d7c527-fe60-47f5-a600-5394e440e13f'] });
return { del: d.s + ' ' + d.t.slice(0, 600), restore: r.s + ' ' + r.t.slice(0, 400) };
