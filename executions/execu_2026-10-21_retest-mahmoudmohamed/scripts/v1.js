const items = []; let cur = null;
for (let i = 0; i < 3; i++) { const ev = await api('GET', '/audit/events?limit=100' + (cur ? '&cursor=' + encodeURIComponent(cur) : '')); if (ev.s !== 200) return done({ s: ev.s, t: ev.t.slice(0, 200) }); items.push(...arr(ev.j?.data)); cur = ev.j?.meta?.next_cursor; if (!cur) break; }
const newest = items.slice(0, 8).map(x => x.occurred_at.slice(0, 19) + ' ' + x.app_key + ' ' + x.action + ' ' + x.target_type + ' ' + (x.target_label || ''));
const byApp = {}; for (const x of items) byApp[x.app_key] = (byApp[x.app_key] || 0) + 1;
const perApp = {}; for (const k of ['crm', 'desk', 'iam', 'workflow']) { const r = await api('GET', `/audit/events?limit=5&app_key=${k}`); perApp[k] = r.s + ' ' + arr(r.j?.data).map(x => x.occurred_at.slice(0, 16) + ' ' + x.action.replace('audit.action.', '') + ' ' + x.target_type.replace('audit.entity.', '')).join(' | '); }
return done({ newest, byApp, perApp });
