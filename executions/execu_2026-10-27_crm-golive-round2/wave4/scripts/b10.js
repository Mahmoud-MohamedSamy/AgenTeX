// Round 2 Wave 4 batch 10: which QA R2W4 leads exist now (spam-trap check), with their source.
const out = { now: new Date().toISOString() };
const r = await call('GET', `/modules/${MODS.leads}/records?page=1&per_page=60&layout_id=bf971461-2edc-45f2-b6e4-6e180aa64288&sort_by=created_at&sort_dir=desc`);
out.qaLeads = (r.j.data || []).filter(x => /QA R2W4/.test(JSON.stringify(x))).map(x => x.id + ' | ' + ((x.data.find(e => e.field === 'first_name') || {}).value || {}).value + ' | ' + x.created_at);
const b = await call('GET', '/audit/recycle-bin/items?limit=50');
out.binQa = ((b.j.data && (b.j.data.items || b.j.data)) || []).filter(i => /QA R2W4/.test(i.record_label || '')).map(i => i.record_label + ' ' + i.deleted_at);
return out;
