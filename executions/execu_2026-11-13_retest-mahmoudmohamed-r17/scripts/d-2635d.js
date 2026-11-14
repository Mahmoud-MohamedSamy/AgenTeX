const T='88e8ea44-1658-4df3-9930-d0902b91073d', CL='f7e488b5-0232-42fd-811c-1f24356af653'; const tid=I.A35.ticket;
const f=arr((await api('GET','/modules/'+CL+'/fields')).j.data).filter(x=>x.isRequired||x.required||x.is_required).map(x=>(x.fieldName||x.field_name)+':'+(x.datatypeKey)+':'+JSON.stringify((x.datatypeOptions||{}).allowed_values||'').slice(0,80));
const vals={subject:'QA RT17 2635 call',department:I.D74,ticket_id:tid,related_to:T+':'+tid,call_status:'scheduled',name:'QA RT17 2635 call',call_type:'Outbound',call_start_time:'2026-11-20T10:00:00Z',contact_id:I.S10.B.id};
let r=await api('POST','/modules/'+CL+'/records',rec(vals)); let id=r.j&&r.j.data&&r.j.data.id; if(id){I.A35.call=id;SAVE();LED('desk call QA RT17 2635 call '+id);}
return {required:f, create:SR(r)+' '+(id?id:r.t.slice(0,500))};
