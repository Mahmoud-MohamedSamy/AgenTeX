const TK='88e8ea44-1658-4df3-9930-d0902b91073d';
const val=x=>!x?undefined:x.kind==='array'?(x.items||[]).map(val):x.value;
const r=await api('GET','/modules/'+TK+'/records?page=1&per_page=4&sort_by=created_at&sort_dir=desc');const o=[];
for(const x of arr(r.j?.data)){const f=Object.fromEntries(((await api('GET','/modules/'+TK+'/records/'+x.id)).j?.data?.data||[]).map(y=>[y.field,val(y.value)]));
 const a=arr((await api('GET','/desk/tickets/'+x.id+'/activity')).j?.data).filter(y=>y.action==='message.received').map(y=>JSON.stringify(y.summary));
 const rp=arr((await api('GET','/desk/tickets/'+x.id+'/replies')).j?.data).map(y=>[y.direction,y.from_address,(y.to||[]).join(';')]);
 o.push({id:x.id,num:f.ticket_number,subj:f.subject,email:f.email,contact:f.contact_id,bp:(((await api('GET','/modules/'+TK+'/records/'+x.id+'/blueprint-state')).j?.data?.states||[])[0]||{}).blueprintName,a,rp});}
return o;
