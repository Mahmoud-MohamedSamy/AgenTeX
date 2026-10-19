const mods = await api('GET', '/modules'); const ml = arr(mods.j && mods.j.data);
const tasks = ml.filter(m => /task/i.test(JSON.stringify(m.labels || m.name || m.moduleKey || ''))).map(m => ({ id: m.id, key: m.moduleKey || m.key, l: m.labels }));
const res = {};
for (const t of tasks) { const f = await api('GET', '/modules/' + t.id + '/fields'); const fl = arr(f.j && f.j.data);
  res[t.id] = { key: t.key, fields: fl.map(x => x.apiName + ':' + x.datatypeKey), pri: JSON.stringify(fl.find(x => /priority/i.test(x.apiName)) || null).slice(0, 900) }; }
return done({ tasks, res });
