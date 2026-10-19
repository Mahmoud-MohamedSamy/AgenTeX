const out = {};
await go('/', 8000);
const me = await api('GET', '/iam/me'); out.user = me.j.data.display_name;
const perms = await api('GET', '/iam/me/permissions'); out.hasViewsManage = /metadata\.views\.manage/.test(perms.t); out.permSample = (perms.t.match(/metadata\.views[^"]*/g) || []).slice(0, 5);
return done(out);
