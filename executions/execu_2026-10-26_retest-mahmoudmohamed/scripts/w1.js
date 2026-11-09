const out = {};
for (const p of ['/desk/skills', '/desk/teams', '/desk/collaboration/connections', '/desk/email-templates', '/desk/business-hours', '/desk/departments'])
  { const r = await api('GET', p); out[p] = r.t.slice(0, 260); }
const rules = await api('GET', '/workflow/rules?take=200'); out.full = rules.j?.data;
return done(out);
