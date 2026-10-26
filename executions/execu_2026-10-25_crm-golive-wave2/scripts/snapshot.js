const snap = {};
for (const [k, id] of Object.entries(MODS)) {
  const r = await call('GET', `/modules/${id}/records?limit=1`);
  const v = await call('GET', `/modules/${id}/views`);
  const tg = await call('GET', `/modules/${id}/tags/usage`);
  snap[k] = { recStatus: r.s, meta: r.j && r.j.meta, views: v.s === 200 ? v.j.data : v.s, tags: tg.s === 200 ? tg.j.data : tg.s };
}
const pl = await call('GET', `/modules/${MODS.deals}/pipelines`);
const cc = await call('GET', `/modules/${MODS.leads}/conversion/config`);
const ct = await call('GET', `/modules/${MODS.leads}/conversion/targets`);
const rbf = await call('GET', `/audit/recycle-bin/facets`);
const rbi = await call('GET', `/audit/recycle-bin/items?limit=1`);
const ar = await call('GET', `/workflow/assignment-rules`);
return { modules: snap, pipelines: pl.j, conversionConfig: cc.j, conversionTargets: ct.j, recycleFacets: rbf.j, recycleItems: { s: rbi.s, meta: rbi.j && rbi.j.meta }, assignmentRules: ar.s === 200 ? ar.j.data : ar.s };
