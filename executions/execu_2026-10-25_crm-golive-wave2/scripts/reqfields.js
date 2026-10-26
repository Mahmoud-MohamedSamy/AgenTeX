const out = {};
for (const [k, id] of Object.entries(MODS)) {
  const f = await call('GET', `/modules/${id}/fields`);
  const fs_ = Array.isArray(f.j.data) ? f.j.data : (f.j.data.fields || []);
  out[k] = fs_.filter(x => x.required || x.unique || ['owner','pipeline','stage','status','call_type','case_origin'].includes(x.apiName)).map(x => ({ api: x.apiName, dt: x.datatypeKey, req: x.required, uniq: x.unique, sys: x.isSystemManaged,
    opts: JSON.stringify(x.datatypeOptions || x.config || {}).slice(0, 300) }));
}
return out;
