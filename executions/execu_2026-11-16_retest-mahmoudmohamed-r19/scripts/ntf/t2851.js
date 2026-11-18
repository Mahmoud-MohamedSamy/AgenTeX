// closing rule ON in D (from 3053), Happiness off. All contacts = user's plus-address.
const R={};const mk=s=>mkT(s,{contact_id:I.contact,email:MAIL});
const rule=Ls((await api('GET','/desk/notification-rules/departments/'+D)).j?.data).find(x=>x.key==='contact.ticket_closed');R.rule='en='+rule.is_enabled;
const h=(await api('GET','/desk/happiness/settings')).j.data;R.happ='on='+h.is_enabled;
const b1=await mk('2851 bulk close 1'),b2=await mk('2851 bulk close 2'),m1=await mk('2851 mass status 1'),m2=await mk('2851 mass status 2'),s1=await mk('2851 single close control');
await sleep(4000);
R.bulkAt=new Date().toISOString();R.bulk=E(await api('POST','/desk/tickets/bulk/close',{ticket_ids:[b1.id,b2.id]}));
R.massAt=new Date().toISOString();const ms=await api('POST','/desk/tickets/bulk/status',{ticket_ids:[m1.id,m2.id],status:'Closed'});R.mass=E(ms)+' '+MASK(ms.t).slice(0,300);
R.singleAt=new Date().toISOString();R.single=E(await api('POST','/desk/tickets/'+s1.id+'/close',{}));
I.t2851={b1,b2,m1,m2,s1,bulkAt:R.bulkAt,massAt:R.massAt,singleAt:R.singleAt};saveI();
await sleep(45000);
for(const [k,t] of Object.entries({b1,b2,m1,m2,s1})){const r=await rec(t.id);R[k]={n:r.ticket_number,status:r.status,feed:(await feedS(t.id)).filter(x=>!/department_changed|ticket.created/.test(x))};}
return R;
