const o = {}; const all = arr((await api('GET', `/modules/${M.leads}/layouts`)).j?.data);
for (const id of ['d67279e5', '35835ce5', 'bf971461']) { const L = all.find(x => String(x.id).startsWith(id)); const g = (await api('GET', `/modules/${M.leads}/layouts/${L.id}`)).j?.data; const u = await api('GET', `/modules/${M.leads}/layouts/${L.id}/record-usage`);
  const fields = []; JSON.stringify(g, (k, v) => { if (v && typeof v === 'object' && (v.fieldApiName || v.field_api_name || v.apiName)) fields.push(v.fieldApiName || v.field_api_name || v.apiName); return v; });
  o[L.name] = { id: L.id, keys: Object.keys(g || {}), access: JSON.stringify({ a: g?.access_mode ?? g?.accessMode, p: g?.profileIds ?? g?.profile_ids ?? g?.access_profile_ids, st: g?.status }), usage: JSON.stringify(u.j?.data).slice(0, 200), nFields: fields.length, fields: [...new Set(fields)].slice(0, 60) }; }
return o;
