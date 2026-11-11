// NT-10 rating received (user OK 11 Nov): happiness on, scoped to QA AO Dept A only; ticket owned by Mahmoud Samy with the user's Gmail as contact; close -> closed mail with rating link.
// Restore settings from ../nt10h-orig.json after the user rates (nt10r-clean.js).
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b',M='88e8ea44-1658-4df3-9930-d0902b91073d',C='43004ce2-577f-4eda-b00a-0750fe40c3d4',SAMY='d23fb4e0-248d-41f6-af60-d28885a7007e';
const G='mahmoud.mmohamedsamy@gmail.com';const u=Math.random().toString(36).slice(2,6);const S={u};const R={u};const f=(k,v)=>({field:k,value:{kind:'string',value:v}});
const o=(await api('GET','/desk/happiness/settings')).j.data;if(!fs.existsSync('../nt10h-orig.json'))fs.writeFileSync('../nt10h-orig.json',JSON.stringify(o));
const ro=['expiry_days_min','expiry_days_max','question_max_length','public_page_configured','supervisors_max','closed_email_subject_max','closed_email_body_max','resend_after_hours_max','option_icons','option_label_max','option_text_max','option_image_max_bytes'];
const body={...o,is_enabled:true,department_scope_enabled:true,department_ids:[A]};for(const k of ro)delete body[k];
const p=await api('PUT','/desk/happiness/settings',body);R.put=p.s+(p.s>=300?' '+p.t.slice(0,300):'');
const now=(await api('GET','/desk/happiness/settings')).j.data;R.now={is_enabled:now.is_enabled,scope:now.department_scope_enabled,depts:now.department_ids,trigger:now.trigger,notify_owner:now.notify_owner_on_rating};
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' NT-10 rating: happiness settings ON scoped to QA AO Dept A ('+R.put+'); original in nt10h-orig.json — RESTORE after test.\n');
if(p.s>=300)return R;
const ct=await api('POST','/modules/'+C+'/records',{data:[f('last_name','QA AO NT10r'+u),f('email',G)]});S.contact=ct.j?.data?.id;
const t=await api('POST','/modules/'+M+'/records',{data:[f('subject','QA AO NT10r'+u+' rating test'),f('description','QA AO NT10r'+u),f('department',A),f('status','Open'),f('priority','high'),f('contact_id',S.contact),f('email',G),f('owner',SAMY)]});S.ticket=t.j?.data?.id;
await sleep(5000);const d=(await api('GET','/modules/'+M+'/records/'+S.ticket)).j?.data?.data||[];const g=k=>d.find(x=>x.field===k)?.value?.value;S.num=g('ticket_number')||g('number');R.ticket={num:S.num,owner:g('owner')===SAMY?'Mahmoud Samy':g('owner')};
fs.writeFileSync('../nt10r.json',JSON.stringify(S));fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' NT-10 rating: contact + ticket #'+S.num+' in QA AO Dept A — delete with nt10r-clean.js.\n');
R.close=(await api('POST','/desk/tickets/'+S.ticket+'/close',{})).s;await sleep(45000);
const j=(await api('GET','/desk/tickets/'+S.ticket+'/activity')).j;const L=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);
R.feed=L.map(e=>(e.action||'')+' @'+(e.occurred_at||'').slice(11,19)+' '+JSON.stringify(e.data||e.details||e.payload||{}).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g,'<e>').slice(0,160));
return R;
