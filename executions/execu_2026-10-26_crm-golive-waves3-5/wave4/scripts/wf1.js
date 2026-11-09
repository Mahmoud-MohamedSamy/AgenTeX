const out = { found: [] };
for (let p = 1; p <= 3 && !out.found.length; p++) {
  const r = await call('GET', `/modules/${MODS.leads}/records?page=${p}&per_page=100&sort_by=created_at&sort_dir=desc`);
  for (const x of (r.j.data || [])) { const v = k => { const f = x.data.find(e => e.field === k); return f && f.value && (f.value.value !== undefined ? f.value.value : f.value); };
    if (/QA W4 Webform/.test(String(v('first_name')))) out.found.push({ id: x.id, layout: x.layout_id, name: v('first_name'), phone: v('phone'), email: v('email'), company: v('company'), owner: v('owner'), source: x.source || v('lead_source'), created: x.created_at }); } }
const f = await call('GET', '/web-forms/b9137a0a-feb6-4a0b-a117-309317f6de79');
const subs = await call('GET', '/web-forms/b9137a0a-feb6-4a0b-a117-309317f6de79/submissions');
const an = await call('GET', '/web-forms/b9137a0a-feb6-4a0b-a117-309317f6de79/analytics');
out.form = f.s; out.submissions = subs.s + ' ' + subs.t.slice(0, 500); out.analytics = an.s + ' ' + an.t.slice(0, 300);
return out;
