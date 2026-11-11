// NT-30 template retry (user 11 Nov: "do the template retry for NT-30"). Binds the built-in agent/team templates on 3 QA AO Dept A rules (originals saved), then:
// phase A (agent active): T5 assigned to NT-30, comment on T5, team ticket T6, control T7 assigned to Mahmoud Samy; phase B (suspended): comment on T5, team ticket T8.
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b',M='88e8ea44-1658-4df3-9930-d0902b91073d',SAMY='d23fb4e0-248d-41f6-af60-d28885a7007e';const n=JSON.parse(fs.readFileSync('../nt30.json','utf8'));const U=n.uid;
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const R={rules:{}};const L1=s=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' NT-30 tpl '+s+'\n');const now=()=>new Date().toISOString().slice(11,19);
const tl=(await api('GET','/desk/email-templates?per_page=200')).j.data.email_templates;const T={};n.templates=n.templates||[];
for(const k of ['agent.ticket_assigned','agent.comment_added','team.ticket_assigned']){const sys=tl.find(t=>t.is_system&&t.use_case===k);const c=await api('POST','/desk/email-templates',{name:'QA AO NT30 '+k,module:'desk_tickets',notification_type:sys.notification_type,use_case:k,subject:'QA AO NT30 '+k+': '+sys.subject,body_html:sys.body_html});if(c.s>=300)return {templateCreate:k,s:c.s,t:c.t.slice(0,300)};T[k]=c.j.data.id;n.templates.push(T[k]);fs.writeFileSync('../nt30.json',JSON.stringify(n));L1('template '+T[k]+' '+k);}
const rules=(await api('GET','/desk/notification-rules/departments/'+A)).j.data.rules;const orig={};
for(const k of Object.keys(T)){const r=rules.find(x=>x.key===k);orig[k]={is_enabled:r.is_enabled,template_id:r.template_id};}
if(!fs.existsSync('../nt30-rules-orig.json'))fs.writeFileSync('../nt30-rules-orig.json',JSON.stringify(orig));
for(const k of Object.keys(T)){const p=await api('PUT','/desk/notification-rules/departments/'+A+'/rules/'+encodeURIComponent(k),{is_enabled:true,template_id:T[k]});R.rules[k]=p.s+(p.s>=300?' '+p.t.slice(0,160):'')+' was '+JSON.stringify(orig[k]);}
if(Object.values(R.rules).some(v=>!/^2/.test(v)))return R;L1('rules bound to QA templates in QA AO Dept A '+JSON.stringify(R.rules).slice(0,200)+' (restore from nt30-rules-orig.json)');
const after=(await api('GET','/desk/notification-rules/departments/'+A)).j.data.rules.filter(x=>T[x.key]).map(x=>x.key+' tpl='+(x.template_name||x.template_id)+' sent='+JSON.stringify(x.channels));R.after=after;if(after.some(a=>/tpl=null/.test(a)))return R;
const tk=async(tag,extra)=>{const r=await api('POST','/modules/'+M+'/records',{data:[f('subject','QA AO '+n.u+' '+tag),f('description','QA AO '+n.u+' '+tag),f('department',A),f('status','Open'),f('priority','high'),...extra]});const id=r.j?.data?.id;if(id){n.tickets.push(id);fs.writeFileSync('../nt30.json',JSON.stringify(n));}await sleep(4000);
 const x=id?((await api('GET','/modules/'+M+'/records/'+id)).j?.data?.data||[]):[];return {s:r.s,num:x.find(e=>e.field==='ticket_number')?.value?.value,id,at:now()};};
R.status0=(await api('PATCH','/iam/users/'+U,{status:'Active'})).s;await sleep(3000);
R.A={};R.A.t5=await tk('T5 assigned to NT-30 (tpl, active)',[f('owner',U)]);
await sleep(5000);R.A.comment=(await api('POST','/desk/tickets/'+R.A.t5.id+'/comments',{body_html:'<p>QA AO '+n.u+' comment while ACTIVE (tpl)</p>',is_public:false})).s+' @'+now();
R.A.t6=await tk('T6 team ticket (tpl, active)',[f('team',n.team),{field:'owner',value:{kind:'null'}}]);
R.A.t7=await tk('T7 control assigned to Mahmoud Samy (tpl)',[f('owner',SAMY)]);
await sleep(60000);
R.suspend=(await api('PATCH','/iam/users/'+U,{status:'Suspended'})).s+' @'+now();L1('agent suspended');await sleep(10000);
R.B={};R.B.comment=(await api('POST','/desk/tickets/'+R.A.t5.id+'/comments',{body_html:'<p>QA AO '+n.u+' comment while SUSPENDED (tpl)</p>',is_public:false})).s+' @'+now();
R.B.t8=await tk('T8 team ticket (tpl, suspended)',[f('team',n.team),{field:'owner',value:{kind:'null'}}]);
L1('tickets '+[R.A.t5,R.A.t6,R.A.t7,R.B.t8].map(t=>'#'+t.num).join(','));for(const t of [R.A.t5,R.A.t6,R.A.t7,R.B.t8])delete t.id;return R;
