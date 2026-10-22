const stop = capOn();
const m = await api('GET', '/modules?limit=200');
const mods = arr(m.j).map(x => ({ id: x.id, key: x.moduleKey || x.key, name: x.name || x.pluralLabel }));
await go('/settings/pipelines', 9000);
stop();
return done({ mods: mods.slice(0, 60), url: page.url(), cap: cap.filter(c => !/translations|notifications/.test(c)).slice(0, 40), body: (await txt()).slice(0, 1500) });
