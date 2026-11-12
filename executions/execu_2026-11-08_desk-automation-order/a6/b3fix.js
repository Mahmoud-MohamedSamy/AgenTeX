const field = async () => L((await api('GET', `/modules/${TK}/fields?take=300`)).j?.data).find(x => x.apiName === 'status' || x.fieldName === 'status');
const vals = f => (f.datatypeOptions?.allowed_values || []).map(v => typeof v === 'string' ? v : (v.value || v.label));
const f = await field(); const v = vals(f); const before = JSON.parse(fs.readFileSync('../a6/b3-out.json', 'utf8')).statusBefore;
const extra = v.filter(x => !before.includes(x)); const missing = before.filter(x => !v.includes(x));
out('diff', { extra, missing, lowercaseOpen: v.filter(x => x.toLowerCase() === 'open') });
const keepV = (f.datatypeOptions.allowed_values || []).filter(x => !extra.includes(typeof x === 'string' ? x : (x.value || x.label)));
if (extra.length) { const r = await api('PUT', `/modules/${TK}/fields/${f.id}`, { fieldName: f.fieldName, labels: f.labels || {}, datatypeKey: f.datatypeKey, datatypeOptions: { ...f.datatypeOptions, allowed_values: keepV }, required: !!(f.required || f.config?.required), unique: !!(f.unique || f.config?.unique) }); out('put', E(r)); }
const v2 = vals(await field()); out('after', { sameAsBefore: JSON.stringify(v2) === JSON.stringify(before), count: v2.length, before: before.length });
const bh = (await api('GET', '/desk/business-hours')).j?.data; out('holidayLists', (bh.holiday_lists || []).map(h => [h.name, h.is_active, h.business_hour_profile_id, h.category, h.holiday_count])); out('preset', bh.preset);
log(JSON.stringify(R, null, 1));
