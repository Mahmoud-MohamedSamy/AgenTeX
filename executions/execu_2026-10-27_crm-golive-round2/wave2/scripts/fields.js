const o = as(OWNER);
for (const k of ['leads', 'cases', 'po', 'so']) {
  const r = await o.get(`/modules/${MODS[k]}/fields`);
  const fs = Array.isArray(r.j.data) ? r.j.data : r.j.data.fields;
  out[k] = fs.filter(f => !f.isSystem && !/created|modified|_by$|_time$/.test(f.apiName)).map(f => f.apiName + ':' + f.datatypeKey + (f.config && f.config.required ? '*' : '') + (f.datatypeOptions && f.datatypeOptions.allowed_values ? '[' + f.datatypeOptions.allowed_values.slice(0, 4).join('|') + ']' : ''));
}
const lay = await o.get(`/modules/${MODS.leads}/layouts/${LAY.leads}`);
out.leadsLayoutFields = JSON.stringify(lay.j.data.views).match(/"apiName":"[a-z_0-9]+"/g).map(x => x.slice(11, -1)).filter((v, i, a) => a.indexOf(v) === i);
