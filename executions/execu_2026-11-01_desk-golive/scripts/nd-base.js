// Baseline before Wave 2 (NDC)
const o = {}; const g = async p => { const r = await api('GET', p); o[p] = { s: r.s, j: r.j }; };
for (const p of ['/desk/macros', '/desk/snippets', '/desk/ticket-templates', '/desk/tags', `/modules/${T}/views`, '/desk/scheduled-replies', '/audit/recycle-bin/items?limit=50&app=desk', '/desk/sla/policies', '/workflow/rules?take=200', '/desk/departments', '/desk/ticket-statuses', '/desk/ticket-access/settings', '/notifications/unread-count', `/modules/${T}/records?limit=10&sort=-created_at`]) await g(p);
const tm = await api('GET', '/desk/timer/active'); o.timer = { s: tm.s, j: tm.j };
return JSON.stringify(o);
