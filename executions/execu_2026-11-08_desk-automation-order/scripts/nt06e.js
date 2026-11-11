// NT-06 comment edit (11 Nov): contact = user's Gmail, CC = Gmail +qaao, one public comment (API). The edit is done on screen (owner-ui.js). Ids in ../nt06e.json.
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b',M='88e8ea44-1658-4df3-9930-d0902b91073d',C='43004ce2-577f-4eda-b00a-0750fe40c3d4';const G='mahmoud.mmohamedsamy@gmail.com',CC='mahmoud.mmohamedsamy+qaao@gmail.com';
const f=(k,v)=>({field:k,value:{kind:'string',value:v}});const tag='NT06e'+Math.random().toString(36).slice(2,6);const S={tag};const R={tag};
const ct=await api('POST','/modules/'+C+'/records',{data:[f('last_name','QA AO '+tag),f('email',G)]});S.contact=ct.j?.data?.id;
const t=await api('POST','/modules/'+M+'/records',{data:[f('subject','QA AO '+tag+' comment edit'),f('description','QA AO '+tag),f('department',A),f('status','Open'),f('priority','high'),f('contact_id',S.contact),f('email',G)]});S.ticket=t.j?.data?.id;
fs.writeFileSync('../nt06e.json',JSON.stringify(S));fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' NT-06 edit: contact + ticket '+S.ticket+' ('+tag+') — delete after the Gmail check.\n');
await sleep(10000);R.cc=(await api('POST','/desk/tickets/'+S.ticket+'/cc',{address:CC})).s;await sleep(5000);
const c=await api('POST','/desk/tickets/'+S.ticket+'/comments',{body_html:'<p>QA AO '+tag+' public comment ORIGINAL</p>',is_public:true});R.comment=c.s;S.comment=c.j?.data?.id;R.commentAt=new Date().toISOString().slice(11,19);
const d=(await api('GET','/modules/'+M+'/records/'+S.ticket)).j?.data?.data||[];S.num=d.find(e=>e.field==='ticket_number')?.value?.value;R.num=S.num;fs.writeFileSync('../nt06e.json',JSON.stringify(S));
return R;
