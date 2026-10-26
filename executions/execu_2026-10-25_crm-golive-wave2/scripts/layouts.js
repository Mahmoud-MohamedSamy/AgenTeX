const out = {};
for (const [k, id] of Object.entries(MODS)) {
  const l = await call('GET', `/modules/${id}/layouts`);
  const ls = l.s === 200 ? (Array.isArray(l.j.data) ? l.j.data : (l.j.data.layouts || l.j.data.items || [])) : [];
  const f = await call('GET', `/modules/${id}/fields`);
  const fs_ = f.s === 200 ? (Array.isArray(f.j.data) ? f.j.data : (f.j.data.fields || f.j.data.items || [])) : [];
  out[k] = { layoutsStatus: l.s, layouts: ls.map(x => ({ id: x.id, name: x.name || x.label, def: x.isDefault ?? x.is_default, status: x.status })),
    fieldsStatus: f.s, nFields: fs_.length, fieldKeys: fs_[0] ? Object.keys(fs_[0]) : null,
    required: fs_.filter(x => x.isRequired || x.is_required || x.required || x.mandatory).map(x => (x.apiName || x.api_name || x.key) + ':' + (x.dataType || x.data_type || x.type)),
    unique: fs_.filter(x => x.isUnique || x.is_unique || x.unique).map(x => x.apiName || x.api_name || x.key) };
}
return out;
