const mods = (await call('GET', '/modules')).j.data.filter(m => /^qa_w5_auto/.test(m.moduleKey));
const ts = ((await call('GET', '/teamspaces')).j.data || []).filter(t => /^QA W5 TS/.test(t.name));
const out = { mods: mods.map(m => m.moduleKey + ' ' + m.id + ' ' + m.status), ts: ts.map(t => t.name + ' ' + t.id) };
if (mods[0]) { const d = await call('DELETE', `/modules/${mods[0].id}`); out.deleteModule = d.s + ' ' + d.t.slice(0, 300); }
if (ts[0]) { const d = await call('DELETE', `/teamspaces/${ts[0].id}`); out.deleteTs = d.s + ' ' + d.t.slice(0, 300); }
return out;
