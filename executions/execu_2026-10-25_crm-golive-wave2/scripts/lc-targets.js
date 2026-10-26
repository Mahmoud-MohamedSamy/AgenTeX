const t = await call('GET', `/modules/${MODS.leads}/conversion/targets`);
const c = await call('GET', `/modules/${MODS.leads}/conversion/config`);
const mods = await call('GET', `/modules`);
const ml = (Array.isArray(mods.j.data) ? mods.j.data : []).map(m => ({ id: m.id, en: m.labels && m.labels.en, created: m.createdAt, by: m.createdByName }));
const newer = ml.filter(m => !Object.values(MODS).includes(m.id));
return { targets: t.j.data.map(x => x.labels.en + ':' + x.isConversionTarget), configTargets: (c.j.data.targets || []).map(x => x.moduleKey + (x.gatingFieldApiName ? '(gate ' + x.gatingFieldApiName + ')' : '(always)')), newModules: newer };
