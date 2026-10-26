const mods = arr((await api('GET', '/modules')).j?.data).filter(m => /qa_rt_module_1693/.test(m.moduleKey || '')).map(m => m.id + ' ' + m.moduleKey + ' ts=' + (m.teamspaceId || '').slice(0, 8));
const dup = await api('POST', '/teamspaces/5ea90671-4df5-4642-939d-49494f8e4d6e/modules', { moduleKey: 'qa_rt_module_1693', labels: { en: 'QA RT dup' } });
return done({ mods, dup: dup.s + ' ' + dup.t.slice(0, 260) });
