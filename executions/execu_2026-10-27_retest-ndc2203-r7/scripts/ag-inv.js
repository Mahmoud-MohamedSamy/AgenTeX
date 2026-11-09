const T = '88e8ea44-1658-4df3-9930-d0902b91073d'; const val = v => !v ? undefined : v.kind === 'array' ? (v.items || []).map(val) : v.value;
let all = []; for (let p = 1; p < 10; p++) { const r = await api('GET', `/modules/${T}/records?page=${p}&per_page=100&sort_by=created_at&sort_dir=desc`); const a = arr(r.j?.data); all.push(...a); if (a.length < 100) break; }
const L = all.map(x => { const o = {}; for (const d of x.data || []) o[d.field] = val(d.value); return { id: x.id, n: o.ticket_number, s: o.subject, owner: o.owner ?? null, team: o.team ?? null }; }).filter(x => /^QA WF/.test(x.s || ''));
const perms = (await api('GET', '/iam/me/permissions')).j?.data; const pk = (Array.isArray(perms) ? perms : perms?.permissions || []).map(x => typeof x === 'string' ? x : x.key || x.permission_key).filter(k => /desk:ticket:(delete|assign|move|pick_up)/.test(k || ''));
return { count: L.length, perms: pk, L };
