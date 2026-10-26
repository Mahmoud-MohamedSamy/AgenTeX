const f = await api('GET', '/desk/integrations/crm/failures?limit=50');
const rows = arr(f.j?.data).filter(x => (x.occurred_at || '') > '2026-10-26T08:05');
return { s: f.s, total: arr(f.j?.data).length, recent: rows.length, latest: arr(f.j?.data).map(x=>x.occurred_at).sort().slice(-3), sample: rows.slice(0, 7).map(x => ({ kind: x.kind, mod: x.module_key, name: x.record_name, code: x.error_code, park: x.park_reason, msg: (x.last_error || '').slice(0, 100) })), keys: Object.keys(arr(f.j?.data)[0] || {}) };
