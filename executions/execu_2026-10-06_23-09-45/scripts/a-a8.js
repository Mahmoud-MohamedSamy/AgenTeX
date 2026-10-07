
const m = arr((await api('GET', '/modules')).j.data).some(x => x.id === '64625328-d671-4fe8-b323-b63b9d15a46c'); const g = await api('GET', '/modules/64625328-d671-4fe8-b323-b63b9d15a46c/records'); await go('/modules/64625328-d671-4fe8-b323-b63b9d15a46c', 7000); const t = await txt(); const s = await shot('A8-agent-after-selected-users');
rec('A8.agent', 'INFO', 'module listed for agent=' + m + '; GET records → ' + g.s + '; records page shows access message=' + /permission|access|not found/i.test(t), { shot: s, listed: m, gs: g.s });
return done();