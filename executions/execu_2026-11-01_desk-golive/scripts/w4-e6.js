const t = await api('GET', '/desk/email-templates/0f472a78-e303-4644-9cd7-ef35c013382d'); const d = D(t.j) || {}; out.tpl = t.s + ' ' + JSON.stringify({ name: d.name, use_case: d.use_case, active: d.is_active ?? d.active, dep: d.department_id || d.department_ids, subject: d.subject, body: String(d.body_html || '').replace(/<[^>]+>/g, ' ').slice(0, 150) });
const s = await api('GET', '/desk/channels/settings'); out.settings = JSON.stringify(D(s.j)).slice(0, 600);
const a = await api('GET', '/desk/tickets/6f9037a0-15b3-4f21-a584-2e21b3b5259e/activities?limit=30'); out.act = a.s + ' ' + arr(D(a.j)).map(x => (x.action || x.type || x.kind) + ':' + String(x.summary || x.description || '').slice(0, 60)).join(' | ').slice(0, 900);
return fin({ out });
