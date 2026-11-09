const u = arr((await api('GET', '/iam/users?app_key=crm&limit=100')).j?.data);
return done({ keys: Object.keys(u[0] || {}).join(','), list: u.map(x => [x.email, x.userId || x.id || x.user_id, x.lastLoginAt || x.last_login_at || x.lastSignInAt || '', x.status]) });
