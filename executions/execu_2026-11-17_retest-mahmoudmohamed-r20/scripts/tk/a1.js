if(!C.D){const r=await api('POST','/desk/departments',{name:'QA RT20 TK Dept',description:'QA retest round 20 TK lane',agent_user_ids:[O]});log('D',E(r));if(r.j?.data?.id){C.D=r.j.data.id;saveC();LED('department "QA RT20 TK Dept" '+C.D+' created, agent owner');}}
if(!C.D2){const r=await api('POST','/desk/departments',{name:'QA RT20 TK Dept B',description:'QA retest round 20 TK lane (share target)',agent_user_ids:[O]});log('D2',E(r));if(r.j?.data?.id){C.D2=r.j.data.id;saveC();LED('department "QA RT20 TK Dept B" '+C.D2+' created, agent owner');}}
const t=await mkT('probe ticket');log(t);
if(t.id){LED('ticket created '+t.id+' "QA RT20 TK probe ticket"');const o=await rec(t.id);log(o.ticket_number,o.status,o.department===C.D);}
