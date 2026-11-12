const t = (await findT('QA GL W4 portal 01'))[0]; out.id = t.id;
const keep = ['ticket_number','subject','status','channel','department_id','contact_id','email','priority','description','classification','product_id','attachments'];
out.t = Object.fromEntries(Object.entries(t).filter(([k]) => keep.includes(k) || /contact|depart|channel|source|portal/i.test(k)).map(([k,v]) => [k, typeof v === 'string' ? v.slice(0,150) : v]));
const th = await api('GET', '/desk/tickets/' + t.id + '/threads'); out.thS = th.s; out.threads = arr(D(th.j)).map(x => ({ dir: x.direction, ch: x.channel, from: x.from_address || x.from, vis: x.visibility, txt: String(x.content || x.body || x.summary || '').replace(/<[^>]+>/g,' ').slice(0,120) }));
if (out.t.contact_id) { const c = await api('GET', '/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records/' + out.t.contact_id); const cf = flat(D(c.j) || {}); out.contact = { name: [cf.first_name, cf.last_name].join(' '), email: cf.email }; }
await go('/tickets/' + t.id, 9000); await shot('w4/W4-44-portal-ticket');
return fin({ out });
