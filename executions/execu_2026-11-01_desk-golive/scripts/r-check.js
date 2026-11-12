const out = {};
const all = { ...IDS, clone: 'e806b5ce-c550-4301-becc-f8252fd467f4', screen: '5daa40f1-bd4c-424a-930b-d4bb5759201b' };
for (const [k, id] of Object.entries(all)) { const r = await api('GET', '/desk/tickets/' + id); const d = r.j && r.j.data; out[k] = r.s === 200 ? [d.ticket_number, d.status, d.department_id && d.department_id.slice(0,8), d.owner_id ? d.owner_id.slice(0,8) : null, d.spam ? 'spam' : '', d.archived ? 'arch' : ''] : r.s; }
const ap = await api('GET', '/desk/tickets/' + IDS.base + '/approvals'); out.approvals = ap.s + ' ' + JSON.stringify(arr(ap.j && ap.j.data).map(x => [x.subject, x.status, (x.approver_user_ids||[]).map(u=>u.slice(0,8))]));
for (const k of ['base', 'email', 'child_2']) { const d = await api('GET', '/desk/tickets/' + IDS[k] + '/drafts'); out['drafts_' + k] = d.s + ' ' + JSON.stringify(arr(d.j && d.j.data).map(x => [x.id.slice(0,8), x.review_state, (x.body_html||'').slice(0,40)])); }
const me = await api('GET', '/iam/me'); out.me = me.s + ' ' + ((me.j && me.j.data && (me.j.data.email || (me.j.data.user||{}).email)) || '');
return fin(out);
