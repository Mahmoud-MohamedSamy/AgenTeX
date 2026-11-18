const H = JSON.parse(fs.readFileSync(RUN + '/scripts/hc/hc.json', 'utf8'));

const r = await api('POST', '/modules/' + TK + '/records', { data: fields({ subject: 'QA RT19 HC 3044 portal reply', description: 'QA RT19 HC 3044: please reply to this ticket from the Help Center.', department: CS, status: 'Open', priority: 'medium', owner: OWNER, contact_id: H.contact }) });
const id = r.j?.data?.id; if (!id) return E(r);
made.tickets.push(id); keep(); await sleep(3000); const t = await rec(id); LED('ticket created ' + id + ' #' + t.ticket_number + ' "QA RT19 HC 3044 portal reply" (Customer Support, contact +r19hc)');
H.t3044 = id; H.n3044 = t.ticket_number; H.at3044 = new Date().toISOString(); fs.writeFileSync(RUN + '/scripts/hc/hc.json', JSON.stringify(H, null, 1));
const h = await histRaw(id); return { id, n: t.ticket_number, contact: t.contact_id === H.contact, status: t.status, email: !!t.email, hist: h.map(x => x.action) };
