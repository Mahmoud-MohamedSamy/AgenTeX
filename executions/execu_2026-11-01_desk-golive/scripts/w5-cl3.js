const TM = '88e8ea44-1658-4df3-9930-d0902b91073d';
let items = []; for (const q of ['?limit=200', '?limit=200&app=desk']) { const rb = await api('GET', '/audit/recycle-bin/items' + q); items.push(...arr(D(rb.j))); }
items = [...new Map(items.map(i => [i.id, i])).values()];
const pick = items.filter(i => /^QA GL W5( |$)/.test(i.record_label || '') || /qa-gl-w5/.test(i.record_label || '') || ['efa2c92a-7145-4b79-85e8-1de588d04ff0', 'f6f41699-f11d-4a94-819d-f65c56457133'].includes(i.record_id));
out.pick = pick.map(i => i.module_label + ':' + i.record_label); if (pick.length) out.purge = (await api('POST', '/audit/recycle-bin/delete', { item_ids: pick.map(x => x.id), ids: pick.map(x => x.id) })).s;
// diff checks
const cnt = async (mod, field, val) => { const f = [{ field, operator: 'contains', value: val }]; const r = await api('GET', '/modules/' + mod + '/records?page=1&per_page=1&filters=' + encodeURIComponent(JSON.stringify(f))); return r.j && r.j.meta ? r.j.meta.total_count : r.s; };
out.left = { contacts: await cnt(CM, 'first_name', 'QA GL W5'), accounts: await cnt(AM, 'account_name', 'QA GL W5'), tickets: await cnt(TM, 'subject', 'QA GL W5'), contracts: await cnt(KM, 'contract_name', 'QA GL W5'), products: await cnt(PM, 'product_name', 'QA GL W5') };
const ts = await api('GET', '/desk/tab-settings'); out.tabs = JSON.stringify({ a: (D(ts.j) || {}).arrangement, home: (D(ts.j) || {}).home });
const lh = await api('GET', '/desk/legal-holds?page=1&page_size=20'); out.holds = arr(D(lh.j)).length;
const ca = await api('GET', '/workflow/custom-actions'); out.actions = arr(D(ca.j)).filter(a => /QA GL W5/.test(a.name)).length;
const fl = await api('GET', '/modules/' + CM + '/fields'); out.fields = arr(D(fl.j)).filter(f => /qa_gl_w5/.test(f.apiName)).length;
const deps = await api('GET', '/desk/departments'); out.depts = arr(D(deps.j)).filter(d => /QA GL W5/.test(d.name)).length;
return fin({ out });
