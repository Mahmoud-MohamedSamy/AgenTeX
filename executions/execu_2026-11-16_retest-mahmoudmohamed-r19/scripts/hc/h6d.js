const o={};
const r = await api('POST', '/modules/' + TK + '/records', { data: fields({ subject: 'QA RT19 HC probe DA', description: 'QA RT19 HC probe', department: DA, status: 'Open' }) }); o.da = E(r); if (r.j?.data?.id) { made.tickets.push(r.j.data.id); keep(); LED('ticket created '+r.j.data.id+' "QA RT19 HC probe DA"'); }
return o;
