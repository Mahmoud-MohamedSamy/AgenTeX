const H = JSON.parse(fs.readFileSync(RUN + '/scripts/hc/hc.json', 'utf8')); const o={};
const s = await api('POST', '/desk/tickets/search', {q:'QA RT19 HC 3044'}); o.search=s.s;
const l = await api('GET', '/modules/' + TK + '/records?pageSize=50&sortBy=created_at&sortOrder=desc'); o.recent = L(l.j?.data).map(x=>{const d={};for(const f of x.data||[]) if(['subject','ticket_number'].includes(f.field)) d[f.field]=f.value?.value; return d.subject+' #'+d.ticket_number}).filter(x=>/HC 3044/.test(x));
const r = await api('POST', '/modules/' + TK + '/records', { data: fields({ subject: 'QA RT19 HC 3044 probe nocontact', description: 'QA RT19 HC probe', department: CS, status: 'Open' }) }); o.noContact = E(r); if (r.j?.data?.id) { made.tickets.push(r.j.data.id); keep(); LED('ticket created '+r.j.data.id+' "QA RT19 HC 3044 probe nocontact" (CS)'); }
return o;
