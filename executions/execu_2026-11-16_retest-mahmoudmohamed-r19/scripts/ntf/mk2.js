const a=await mkT('2851 massupd 1',{contact_id:I.contact,email:MAIL}),b=await mkT('2851 massupd 2',{contact_id:I.contact,email:MAIL});I.t2851mu=[a,b];saveI();
const r={};for(const id of ['e97b1c04-d87d-454d-bcab-9ffbc9b5b06a','9cdf799d-65bd-4107-96a1-185b91fd8afc']){const x=await rec(id);r[x.ticket_number]={status:x.status,feed:(await feedS(id)).filter(y=>!/department_changed|ticket.created/.test(y)),replies:Ls((await api('GET','/desk/tickets/'+id+'/replies')).j?.data).length};}
return {a:a.id,b:b.id,r};
