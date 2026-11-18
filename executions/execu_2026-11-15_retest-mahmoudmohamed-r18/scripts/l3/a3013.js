const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
const L=arr((await api('GET','/modules/'+T+'/layouts')).j.data);
for(const l of L){ const f=(await api('GET','/modules/'+T+'/layouts/'+l.id)).j.data; const st=JSON.stringify(f.ticketStatuses||''); if(/Reject/i.test(st)) o[l.name]={id:l.id,deps:f.departmentIds,st:st.slice(0,300)}; }
const F=arr((await api('GET','/modules/'+T+'/fields')).j.data).find(f=>f.fieldName==='qa_ndc_rejection_reasons'); o.field=F&&(F.id+' '+F.datatypeKey);
const s=await api('GET','/desk/ticket-statuses'); o.statuses=s.s+' '+s.t.slice(0,300);
return o;
