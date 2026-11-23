const o={};const mk=async n=>{const r=await api('POST','/modules/'+CON+'/records',{data:fields({last_name:'QA RT22 Contact '+n,first_name:'Probe',email:'qa.rt22.c'+n+'@example.com'})});const id=r.j?.data?.id;if(id){made.other.push('contact '+id);keep();LED('3064: contact QA RT22 Contact '+n+' '+id);}return {s:r.s,id,err:r.s>=300?r.t.slice(0,300):undefined};};
o.c1=await mk(1);o.c2=await mk(2);
const t=await mkT('3064','edit form',{priority:'low'});await sleep(3000);o.t={id:t,n:(await api('GET','/desk/tickets/'+t)).j?.data?.ticket_number};
fs.writeFileSync(RUN+'/out/3064.json',JSON.stringify(o));return o;
