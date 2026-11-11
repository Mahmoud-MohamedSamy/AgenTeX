// NT-07 retest: contact = user's Gmail, CC = mmohamed@anyware.software (separate mailbox). Close the ticket, read which mails the feed logs and to whom. Keeps the ticket for the user's mailbox check.
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b',M='88e8ea44-1658-4df3-9930-d0902b91073d',C='43004ce2-577f-4eda-b00a-0750fe40c3d4';
const G='qa.ao.nt07@example.com',CC='mahmoud.mmohamedsamy+qaao@gmail.com';
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const u=Math.random().toString(36).slice(2,6),tag='NT07'+u;const R={tag};
const mask=s=>s.replace(/mahmoud\.mmohamedsamy@gmail\.com/g,'<gmail>').replace(/mmohamed@anyware\.software/g,'<anyware>');
R.rules=((await api('GET','/desk/notification-rules/departments/'+A)).j?.data?.rules||[]).filter(x=>/^(cc|contact)\..*(clos|cc_added|added)/.test(x.key)).map(x=>x.key+'='+x.is_enabled);
const ct=await api('POST','/modules/'+C+'/records',{data:[f('last_name','QA AO '+tag),f('email',G)]});const cid=ct.j?.data?.id;
const t=await api('POST','/modules/'+M+'/records',{data:[f('subject','QA AO '+tag),f('description','QA AO '+tag),f('department',A),f('status','Open'),f('priority','high'),f('contact_id',cid),f('email',G)]});const id=t.j?.data?.id;
await sleep(15000);
const cc=await api('POST','/desk/tickets/'+id+'/cc',{address:CC});R.ccAfter=((await api('GET','/desk/tickets/'+id+'/cc')).t||'').replace(/mahmoud[^"]*gmail.com/g,'<gmail+qaao>').slice(0,200);R.addCC=cc.s+(cc.s>=300?' '+cc.t.slice(0,200):'');await sleep(20000);
const cl=await api('POST','/desk/tickets/'+id+'/close',{});R.close=cl.s;await sleep(40000);
const j=(await api('GET','/desk/tickets/'+id+'/activity')).j;const L=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);
R.mails=L.filter(e=>/reply\.|mail|notif/.test(e.action)).map(e=>e.action+' @'+(e.occurred_at||'').slice(11,19)+' '+mask(JSON.stringify(e.summary||{})).slice(0,300));
R.number=((await api('GET','/modules/'+M+'/records/'+id)).j?.data?.data||[]).find(x=>/ticket_number/.test(x.field))?.value?.value;
R.ticketId=id;R.contactId=cid;fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' NT-07 retest: ticket '+id+' (#'+R.number+', QA AO '+tag+'), contact '+cid+' — kept for the user mailbox check, delete after.\n');
return R;
