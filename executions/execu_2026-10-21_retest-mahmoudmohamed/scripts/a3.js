await go('/settings', 15000);
const me = await api('GET', '/iam/me');
return done({ url: page.url(), me: me.t.slice(0, 500), body: (await txt()).slice(0, 2500) });
