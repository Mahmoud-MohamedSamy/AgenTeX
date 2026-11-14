const P = ['/desk/sla/policies?department_id=' + MK, '/desk/sla/support-plans?department_id=' + MK, '/desk/sla/support-plans?department_id=' + MK + '&status=discontinued', '/desk/tickets/archive/settings', '/desk/spam/settings', '/desk/data/archive/settings', '/desk/custom-actions', '/desk/integrations/custom-actions', '/desk/sla/meta', '/desk/channels/spam-contacts', '/desk/tickets/parent-child/settings', '/desk/tickets/settings'];
out.b = {};
for (const p of P) { const r = await api('GET', p); out.b[p] = { s: r.s, j: r.j ? (JSON.stringify(D(r.j)).length > 4000 ? JSON.stringify(D(r.j)).slice(0, 4000) : D(r.j)) : r.t.slice(0, 200) }; }
return fin({ out });
