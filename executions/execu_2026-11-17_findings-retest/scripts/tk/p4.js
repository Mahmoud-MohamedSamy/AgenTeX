C.f13cloneC='1cf90b07-af55-4996-8a8d-10ea9a5d5215';saveC();LED('ticket created '+C.f13cloneC+' clone of F13 source C via UI (QA AO Dept A)');
for(const k of ['f13a','f13cloneA','f13b','f13c','f13cloneC']){const o=await rec(C[k]);log(k,String(o.ticket_number),'owner',String(o.owner),'dept',String(o.department).slice(0,8));}
