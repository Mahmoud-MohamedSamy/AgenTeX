const ID = '0f472a78-e303-4644-9cd7-ef35c013382d'; const MK = '2a73bbc0-efb3-4250-bf9b-2fdc98236794';
let list = D((await api('GET', '/desk/email-templates?limit=200&use_case=ticket.reply_acknowledgement')).j).email_templates;
const sys = list.find(x => x.is_system || /^system/.test(x.id)); out.sys = sys.id;
for (const body of [{ department_id: MK }, { department_ids: [MK] }, {}]) { const r = await api('POST', '/desk/email-templates/' + encodeURIComponent(sys.id) + '/activate', body); out['act' + Object.keys(body).join('')] = r.s + ' ' + r.t.slice(0, 160); if (r.s < 300) break; }
const d = await api('DELETE', '/desk/email-templates/' + ID); out.del = d.s + ' ' + d.t.slice(0, 160);
list = D((await api('GET', '/desk/email-templates?limit=200&use_case=ticket.reply_acknowledgement')).j).email_templates; out.ack = list.map(x => [x.name, x.department_id ? x.department_id.slice(0, 8) : 'All', x.is_active]);
return fin({ out });
