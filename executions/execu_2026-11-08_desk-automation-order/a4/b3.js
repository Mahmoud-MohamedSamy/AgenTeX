const R={};const cut=(x,n=300)=>String(typeof x==='string'?x:JSON.stringify(x)).slice(0,n);
const rl=await mkRule('L1c',{kind:'RecordCreated'},[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',value:'high'}}}],{isActive:false});
const tm=await mkTicket('L1c',{},'match');
for(const [k,f] of [['stringValue',{subject:{kind:'string',stringValue:'QA AO WF L1c x'}}],['value',{subject:{kind:'string',value:'QA AO WF L1c x'}}],['fromRecord',{}]]){const x=await api('POST','/workflow/rules/'+rl.id+'/execute',{recordId:tm.id,triggerKind:'RecordCreated',fields:f});R['L1_'+k]=x.s+' '+cut(x.j?.data||x.t,260);}
// criteria on priority instead of subject (guard + priority high)
const r2=await mkRule('L1d',{kind:'RecordCreated'},[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',value:'low'}}}],{isActive:false});
const x3=await api('POST','/workflow/rules/'+r2.id+'/execute',{recordId:'rec-sample',triggerKind:'RecordCreated',fields:{subject:{kind:'string',stringValue:'QA AO WF L1d y'}}});R.L1d=x3.s+' '+cut(x3.j?.data||x3.t,260);
const tk=await getTicket(tm.id);R.ticketKeys=Object.keys(tk).join(',');R.desc=cut(tk.description,80);
const ev=arr2((await api('GET','/audit/events?limit=60')).j?.data).find(e=>/audit\.action\.created/.test(e.action||e.event_type||''));R.auditSample=cut(ev,900);
return R;
