await go('/', 9000);
const me = await api('GET', '/iam/me'); const perms = await api('GET', '/iam/me/permissions');
return done({ me: me.j && me.j.data && { name: me.j.data.display_name, id: me.j.data.user_id }, review: /workflow:review:view/.test(perms.t), permsLen: perms.t.length, profile: (perms.t.match(/"profile[^}]{0,200}/) || [''])[0] });
