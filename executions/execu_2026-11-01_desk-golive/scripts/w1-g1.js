const S = x => ({ s: x.s, e: x.j && x.j.error ? (x.j.error.code + ': ' + String(x.j.error.message).slice(0, 160)) : undefined });
const o = {};
// audit: our QA GL writes
let ev = []; for (const q of ['?limit=200', '?limit=200&search=QA%20GL', '?limit=200&q=QA%20GL']) { const r = await api('GET', '/audit/events' + q); const d = r.j && r.j.data; if (Array.isArray(d)) ev = ev.concat(d); }
const mine = ev.filter(e => JSON.stringify(e).includes('QA GL'));
const kinds = {}; for (const e of mine) { const k = (e.entity_type || e.entity || e.resource_type || '?') + ':' + (e.action || e.event_type || '?'); kinds[k] = (kinds[k] || 0) + 1; }
o.W1_56 = { scanned: ev.length, qaEvents: mine.length, kinds, sampleKeys: ev[0] ? Object.keys(ev[0]).join(',') : '' };
// ticket access settings: read + write same back
const ta = await api('GET', '/desk/ticket-access/settings'); o.W1_50 = { get: S(ta), keys: ta.j && ta.j.data ? Object.keys(ta.j.data).join(',') : '' };
if (ta.s === 200) { const put = await api('PUT', '/desk/ticket-access/settings', ta.j.data); const ta2 = await api('GET', '/desk/ticket-access/settings'); o.W1_50.put = S(put); o.W1_50.same = JSON.stringify(ta2.j.data) === JSON.stringify(ta.j.data); if (!o.W1_50.same) o.W1_50.diff = [JSON.stringify(ta.j.data).slice(0, 200), JSON.stringify(ta2.j.data).slice(0, 200)]; }
// statuses read only
const st = await api('GET', '/desk/ticket-statuses'); o.statuses = { ...S(st), d: JSON.stringify(st.j && st.j.data).slice(0, 300) };
return done(o);
