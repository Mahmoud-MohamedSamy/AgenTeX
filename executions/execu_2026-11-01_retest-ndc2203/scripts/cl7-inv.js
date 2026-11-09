// Round 7 cleanup inventory (read-only): everything named "QA WF …" visible to the admin.
const out = {}; const q = s => /^QA WF/.test(s || '');
const recs = async mid => { let all = [], p = 1; for (; p < 20; p++) { const r = await api('GET', `/modules/${mid}/records?page=${p}&per_page=100&sort_by=created_at&sort_dir=desc`); const a = arr(r.j?.data); all.push(...a); if (a.length < 100) break; } return all.map(x => { const o = {}; for (const d of x.data || []) o[d.field] = val(d.value); return { id: x.id, o }; }); };
out.tickets = (await recs(T)).filter(x => q(x.o.subject)).map(x => ({ id: x.id, n: x.o.ticket_number, s: x.o.subject, st: x.o.status }));
out.contacts = (await recs(CONTACTS)).filter(x => q(x.o.last_name) || q(x.o.full_name)).map(x => ({ id: x.id, s: x.o.last_name }));
out.accounts = (await recs('784400e1-4a2a-42c2-b4f3-7ca56e79828a')).filter(x => q(x.o.account_name)).map(x => ({ id: x.id, s: x.o.account_name }));
out.rules = arr((await api('GET', `/workflow/rules?moduleId=${T}&limit=200`)).j?.data).filter(r => q(r.name)).map(r => ({ id: r.id, s: r.name }));
out.actions = arr((await api('GET', '/workflow/actions')).j?.data).filter(a => q(a.name)).map(a => ({ id: a.id, s: a.name }));
out.templates = ((await api('GET', '/desk/email-templates')).j?.data?.email_templates || []).filter(t => q(t.name)).map(t => ({ id: t.id, s: t.name }));
out.layouts = arr((await api('GET', `/modules/${T}/layouts`)).j?.data).filter(l => q(l.name)).map(l => ({ id: l.id, s: l.name }));
out.customActions = arr((await api('GET', '/workflow/custom-actions')).j?.data).filter(a => q(a.name)).map(a => ({ id: a.id, s: a.name }));
out.counts = Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.length]));
return done(out);
