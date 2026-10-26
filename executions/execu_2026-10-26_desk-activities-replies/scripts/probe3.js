// Read-only: raw field shapes for status/priority/category fields + departments names/ids + reply-related dept flags
const out = {};
for (const k of ['tasks', 'calls', 'events']) { const f = await fieldsOf(M[k]); out[k] = f.filter(x => /status|priority|category|call_type|call_outcome|owner|subject|title|due_date|call_start_time|from_time|to_time|call_duration|participants|team/.test(x.fieldName)); }
const d = ((await api('GET', '/desk/departments')).j || {}).data || [];
out.depts = d.map(x => { const o = { id: x.id, name: x.name, agents: (x.agent_user_ids || []).length }; for (const [k, v] of Object.entries(x)) if (typeof v === 'boolean' || /reply|cc|private|email|signature|from/i.test(k)) o[k] = v; return o; });
return done(out);
