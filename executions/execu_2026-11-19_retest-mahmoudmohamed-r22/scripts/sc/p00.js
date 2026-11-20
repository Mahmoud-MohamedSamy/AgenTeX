const out = {};
const r = await api('GET', '/scoring-rules?module_id=' + L); out.list = SR(r); out.rules = arr(r.j && r.j.data).map(x => [x.name, x.is_active, (x.entries||[]).length]);
const mods = await api('GET', '/modules'); out.mods = arr(mods.j && mods.j.data).map(m => m.apiName || m.api_name || m.name).slice(0, 30);
const f = (await fieldsOf(L)).filter(x => /score/i.test(x.fieldName)).map(x => [x.fieldName, x.datatypeKey, x.id]); out.scoreFields = f;
out.wfTriggers = SR(await api('GET', '/workflow-rules/triggers')).slice(0,200);
return out;
