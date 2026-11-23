const id='1dc9f6e3-6899-4e1c-af5c-50019b5f77d7';made.tickets.push(id);keep();LED('3007: user question topic 0c626758 "New Question NDC-3007" -> ticket #7152 '+id);
const tk=(await api('GET','/desk/tickets/'+id)).j?.data||{};const o={n:tk.ticket_number,status:tk.status,created:tk.created_at,keys:Object.keys(tk).join(','),forum:Object.keys(tk).filter(k=>/forum|topic|community|channel|source/i.test(k)).map(k=>k+'='+JSON.stringify(tk[k]).slice(0,200))};
const rr=(await api('GET','/modules/'+TK+'/records/'+id)).j?.data?.data||[];o.recFields=rr.map(f=>f.field).join(',');o.forumRec=rr.filter(f=>/forum|topic|community|channel/i.test(f.field)).map(f=>f.field+'='+JSON.stringify(f.value));
fs.writeFileSync(RUN+'/out/3007.json',JSON.stringify(o,null,1));return o;
