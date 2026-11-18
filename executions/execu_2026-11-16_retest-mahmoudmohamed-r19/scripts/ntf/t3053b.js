const R={};
const b=await rec('f2219c2f-0f2b-4c8b-9ff5-0846b858f1d9');R.Bold={n:b.ticket_number,dept:b.department||b.department_id,contact:!!b.contact_id,subj:b.subject};
const a=await rec(I.t3053A?.id||'86beb1f7-0e4d-4b7e-8ac5-2fffed78232d');R.A={n:a.ticket_number,dept:a.department,status:a.status};
const happ=(await api('GET','/desk/happiness/settings')).j.data;R.happ='on='+happ.is_enabled;
const rule=Ls((await api('GET','/desk/notification-rules/departments/'+D)).j?.data).find(x=>x.key==='contact.ticket_closed');R.rule='en='+rule.is_enabled;
const t=await mkT('3053 B2 happiness off rule on',{contact_id:I.contact,email:MAIL});await sleep(4000);const r=await rec(t.id);t.n=r.ticket_number;t.dept=r.department;R.B2=t;
if(r.department===D){t.closeAt=new Date().toISOString();t.close=E(await api('POST','/desk/tickets/'+t.id+'/close',{}));}
I.t3053B2=t;saveI();await sleep(30000);
t.status=(await rec(t.id)).status;t.feed=await feedS(t.id);
return R;
