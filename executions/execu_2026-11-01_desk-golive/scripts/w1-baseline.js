const out = {};
for (const p of ['/iam/tenant/company-profile','/iam/tenant/company-profile/branding','/iam/tenant/brands','/iam/tenant/business-hours','/iam/tenant/business-hours/profiles','/iam/tenant/shifts','/desk/business-hours','/desk/holiday-lists','/desk/departments','/desk/teams','/iam/users?limit=200','/iam/users/directory','/iam/org-units','/iam/profiles','/iam/permissions','/desk/ticket-access','/iam/me','/iam/me/permissions','/audit/events?limit=5','/audit/events/facets','/desk/agents/me/overview','/desk/queues/agents','/desk/queues/teams','/desk/retention','/desk/legal-holds']) {
  try { const r = await api('GET', p); out[p] = { s: r.s, j: r.j }; } catch (e) { out[p] = { s: 'ERR', e: String(e.message).slice(0, 80) }; }
}
return done(out);
