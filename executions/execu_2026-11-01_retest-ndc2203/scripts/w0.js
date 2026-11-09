// NDC-2203 baseline (read-only): rules on Tickets, and what supporting setup exists.
const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const out = {};
const rules = await api('GET', '/workflow/rules?take=200'); out.rules = arr(rules.j?.data).map(r => ({ id: r.id, name: r.name, mod: r.moduleId || r.module_id, active: r.isActive ?? r.is_active, trig: JSON.stringify(r.trigger || r.executeOn || '').slice(0, 80) }));
out.ruleKeys = Object.keys(arr(rules.j?.data)[0] || {});
for (const p of ['/workflow/actions', '/desk/departments', `/modules/${T}/layouts`, '/desk/skills', '/skills', '/desk/teams', '/teams', '/desk/collaboration/connections', '/collaboration-tools', '/integrations/custom-actions', '/custom-actions', '/desk/email-templates', '/email-templates', '/desk/business-hours', '/business-hours', '/desk/holidays', '/holidays', '/iam/roles', '/workflow/catalog', '/workflow/metadata', '/workflow/triggers', '/workflow/action-types'])
  { const r = await api('GET', p); out[p] = r.s + ' ' + (r.s === 200 ? JSON.stringify(arr(r.j?.data).slice(0, 6).map(x => x.name || x.label || x.key || x.id)).slice(0, 220) : ''); }
return done(out);
