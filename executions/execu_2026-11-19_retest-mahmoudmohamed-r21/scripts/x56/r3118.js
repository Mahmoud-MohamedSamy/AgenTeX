const BP='23339d62-fecf-4324-8950-5fa1bfdef0df';const o={};
let g=await getBp(BP);let r=await api('PUT',`/modules/${TK}/blueprints/${BP}`,{definition:g.definition,isActive:true,revision:g.revision});o.activate=E(r);if(r.s<300)LED('blueprint QA RT20 BS 3056 flow '+BP+' ACTIVATED for r21 3118 (restore: deactivate)');
const id=await mkT('3056 flow','r21 t4',{priority:'high'});o.in=JSON.stringify(await waitIn(id,40)).slice(0,120);o.num=(await api('GET','/desk/tickets/'+id)).j?.data?.ticket_number;
r=await api('PUT',`/modules/${TK}/records/${id}/blueprint/owners/urgent`,{userIds:[OWNER],teamIds:[],departmentOwners:[]});o.ownUrgent=E(r);
r=await runT(id,'urgent','Open');o.urgent=E(r);await sleep(3000);
fs.writeFileSync(RUN+'/out/3118-ticket.json',JSON.stringify({id,num:o.num}));
return o;
