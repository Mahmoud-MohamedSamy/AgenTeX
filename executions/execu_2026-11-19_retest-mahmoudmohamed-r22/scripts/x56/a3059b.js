const T=JSON.parse(fs.readFileSync(RUN+'/out/3059.json','utf8'));const o={};const D=async id=>{const t=(await api('GET','/desk/tickets/'+id)).j?.data||{};return {status:t.status,priority:t.priority,due:t.due_date||t.dueDate,phone:t.phone};};
o.before=await D(T.id);
let r=await api('PATCH','/desk/tickets/'+T.id,{priority:'High'});o.p1=r.s+' '+JSON.stringify(r.j).slice(0,300);
r=await api('PATCH','/desk/tickets/'+T.id,{status:'On Hold'});o.p2=r.s+' '+JSON.stringify(r.j).slice(0,200);
r=await api('PATCH','/desk/tickets/'+T.id2,{due_date:'2026-11-30'});o.p3=r.s+' '+JSON.stringify(r.j).slice(0,200);
o.after=await D(T.id);o.after2=await D(T.id2);
o.privateComment=E(await api('POST','/desk/tickets/'+T.id+'/comments',{body_html:'<p>QA RT22 3059 private comment</p>',is_public:false}));
o.publicComment=E(await api('POST','/desk/tickets/'+T.id+'/comments',{body_html:'<p>QA RT22 3059 public comment</p>',is_public:true}));
return o;
