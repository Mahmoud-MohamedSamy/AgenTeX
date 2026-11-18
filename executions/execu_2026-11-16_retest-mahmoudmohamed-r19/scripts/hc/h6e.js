const o=[];
for (let i=0;i<16;i++){ await sleep(30000); const r = await api('POST', '/modules/' + TK + '/records', { data: fields({ subject: 'QA RT19 HC probe '+i, description: 'QA RT19 HC probe', department: DA, status: 'Open' }) }); o.push(new Date().toISOString().slice(11,19)+' '+E(r).slice(0,60)); if (r.j?.data?.id) { made.tickets.push(r.j.data.id); keep(); LED('ticket created '+r.j.data.id+' "QA RT19 HC probe '+i+'"'); break; } }
return o;
