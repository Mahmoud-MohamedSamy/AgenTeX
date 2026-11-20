const LR='913b2c84-f235-404d-b563-c2cfa9566b6a';
const r=await api('POST','/modules/'+TK+'/records',{layout_id:LR,data:fields({subject:'QA RT20 TK 3072 clone source B',description:'QA RT20 TK retest',status:'On Hold',priority:'Low',department:C.D})});log(E(r));const id=r.j?.data?.id;
if(id){C.t3072b=id;saveC();LED('ticket created '+id+' "QA RT20 TK 3072 clone source B" (On Hold)');log('layout',r.j.data.created_with_layout_id);const o=await rec(id);log(o.status,o.ticket_number);}
