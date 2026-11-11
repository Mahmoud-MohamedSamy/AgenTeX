// Agent-notification mail control (11 Nov): ticket assigned to Mahmoud Samy (email = user's main Gmail). Bell checked separately.
const A='93949fbd-f9df-4e2e-ae45-00b8dc38385b',M='88e8ea44-1658-4df3-9930-d0902b91073d',SAMY='d23fb4e0-248d-41f6-af60-d28885a7007e';const f=(k,v)=>({field:k,value:{kind:'string',value:v}});
const tag='MAILCTL'+Math.random().toString(36).slice(2,6);const r=await api('POST','/modules/'+M+'/records',{data:[f('subject','QA AO '+tag+' agent mail check'),f('description','QA AO '+tag),f('department',A),f('status','Open'),f('priority','high'),f('owner',SAMY)]});
const n=JSON.parse(fs.readFileSync('../nt30.json','utf8'));n.mailctl=r.j?.data?.id;fs.writeFileSync('../nt30.json',JSON.stringify(n));
await sleep(5000);const x=(await api('GET','/modules/'+M+'/records/'+n.mailctl)).j?.data?.data||[];
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' agent mail control ticket '+tag+' '+n.mailctl+' owner Samy — delete with NT-30 cleanup.\n');
return {s:r.s,tag,num:x.find(e=>e.field==='ticket_number')?.value?.value,owner:x.find(e=>e.field==='owner')?.value?.value===SAMY?'Samy':'other',at:new Date().toISOString().slice(11,19)};
