const out = {}; const f = await api('GET', '/audit/recycle-bin/facets'); out.facets = JSON.stringify(f.j).slice(0, 1200);
const mid = await modId(); const del = await api('GET', '/modules/' + mid + '/fields?include_deleted=true'); out.delFields = arr(del.j.data).filter(x => /tmp/.test(x.fieldName)).map(x => x.fieldName + ' ' + x.status);
return out;
