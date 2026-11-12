const ID = '0f472a78-e303-4644-9cd7-ef35c013382d';
let r = await api('POST', '/desk/email-templates/' + ID + '/deactivate', {}); out.deact = r.s + ' ' + r.t.slice(0, 150);
if (r.s >= 300) { const t = D((await api('GET', '/desk/email-templates/' + ID)).j); r = await api('PUT', '/desk/email-templates/' + ID, { ...t, is_active: false }, { 'if-match': String(t.row_version) }); out.put = r.s + ' ' + r.t.slice(0, 150); }
const d = await api('DELETE', '/desk/email-templates/' + ID); out.del = d.s + ' ' + d.t.slice(0, 150);
const list = D((await api('GET', '/desk/email-templates?limit=200&use_case=ticket.reply_acknowledgement')).j).email_templates; out.ack = list.map(x => [x.name, x.department_id ? 'Marketing' : 'All', x.is_active]);
const cat = await api('GET', '/desk/community/categories'); out.cats = arr(D(cat.j)).filter(c => /QA GL W4/.test(c.name)).map(c => [c.id.slice(0, 8), c.name, c.disabled, c.topic_count]);
return fin({ out });
