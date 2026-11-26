const mods = arr((await api('GET', '/modules?app_key=crm&limit=200')).j?.data);
const ts = await api('GET', '/teamspaces'); const tsl = arr(ts.j?.data);
const o = { who: process.env.WHO, modules: mods.map(m => (m.api_name || m.apiName || m.key) + ':' + (m.id || '').slice(0, 8)), teamspaces: { s: ts.s, list: tsl.map(t => ({ id: t.id, name: t.name, mods: JSON.stringify(t.modules || t.module_ids || t.moduleIds || t.tabs || null).slice(0, 200), members: (t.members || t.member_ids || t.memberIds || []).length })) , raw0: JSON.stringify(tsl[0] || ts.j).slice(0, 500) } };
fs.writeFileSync(RUN + `/out/acc-map-${process.env.WHO.replace(/\W/g, '_')}.json`, JSON.stringify({ mods, ts: ts.j }, null, 1)); return o;
