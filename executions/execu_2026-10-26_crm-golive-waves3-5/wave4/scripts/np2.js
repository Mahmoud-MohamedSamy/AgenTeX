const out = {};
for (const p of ['/notifications/preferences/me', '/notifications/unread-count', '/notifications?limit=5', '/iam/me/profile']) { const r = await call('GET', p); out[p] = r.s + ' ' + r.t.slice(0, 160); }
return out;
