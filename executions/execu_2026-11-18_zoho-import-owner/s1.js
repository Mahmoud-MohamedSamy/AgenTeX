const me = await api(page,'GET','myinfo'); out.me = { s: me.s, name: me.j && me.j.name };
const ag = await api(page,'GET','agents?limit=50&status=ACTIVE');
out.agents = (ag.j && ag.j.data || []).map(a => ({ id: a.id, name: a.name, emailLen: (a.emailId||'').length, light: a.isLightAgent }));
