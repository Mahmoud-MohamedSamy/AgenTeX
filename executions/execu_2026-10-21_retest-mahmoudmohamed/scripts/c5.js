const out = { modules: {} };
for (const id of ['c0394292-52a2-446d-a326-06733fe289ba', 'd08b353d-3634-4290-8785-fc6b6ecec00f', '9ef906c2-bdbd-4765-a600-3c724801cc71', '2a423888-d7d4-4cc8-b35b-7aeb8daf91c0']) { const r = await api('DELETE', `/modules/${id}?cascade=true`); out.modules[id.slice(0, 8)] = r.s + ' ' + (r.s >= 300 ? r.t.slice(0, 160) : ''); }
const dts = await api('GET', '/custom-datatypes'); const dt = arr(dts.j?.data).find(x => x.key === 'qa_rt_dt');
out.dtFound = !!dt; if (dt) { let d = await api('DELETE', `/custom-datatypes/${dt.id}`); if (d.s >= 300) d = await api('DELETE', `/custom-datatypes/${dt.key}`); out.dtDelete = d.s + ' ' + (d.s >= 300 ? d.t.slice(0, 160) : ''); }
out.left = (await mods()).filter(m => /qa_rt/.test(m.moduleKey)).map(m => m.moduleKey);
out.dtLeft = arr((await api('GET', '/custom-datatypes')).j?.data).filter(x => /qa_rt/.test(x.key)).map(x => x.key);
const me = await api('GET', '/settings/resolved?app_key=general&key=general.user.locale.language&scope_type=User'); out.language = me.t.slice(0, 160);
return done(out);
