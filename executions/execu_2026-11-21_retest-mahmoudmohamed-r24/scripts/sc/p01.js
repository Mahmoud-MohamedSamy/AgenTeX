const out = {};
const r = await api('GET', '/scoring-rules?module_id=' + L);
out.rules = arr(r.j.data).map(x => x.name + ' | ' + x.is_active + ' | ' + JSON.stringify((x.entries||[]).slice(0,2).map(e=>[e.field_key,e.operator,e.value,e.points])));
out.sample = JSON.stringify(arr(r.j.data)[0]).slice(0,1200);
const mods = await api('GET', '/modules'); out.mods = SR(mods) + ' ' + arr(mods.j && mods.j.data).map(m => (m.apiName || m.api_name || m.key || m.name)+':'+m.id).join(', ').slice(0,1500);
out.scoreFields = (await fieldsOf(L)).filter(x => /score/i.test(x.fieldName)).map(x => JSON.stringify(x).slice(0,600));
return out;
