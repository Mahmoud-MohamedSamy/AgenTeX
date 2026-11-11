// Deletes the ev5 filing-evidence data (tickets, policies, template, contact).
const S=JSON.parse(fs.readFileSync('../ev5.json','utf8'));const M='88e8ea44-1658-4df3-9930-d0902b91073d',C='43004ce2-577f-4eda-b00a-0750fe40c3d4';const out=[];
const ids=[...S.made.filter(x=>x[0]==='ticket').map(x=>x[1])];
for(const id of ids){const d=await api('DELETE','/modules/'+M+'/records/'+id);out.push('ticket '+d.s);}
for(const [k,id] of S.made.filter(x=>x[0]==='policy')){const d=await api('DELETE','/desk/sla/policies/'+id);out.push('policy '+d.s);}
for(const [k,id] of S.made.filter(x=>x[0]==='tpl')){const d=await api('DELETE','/desk/email-templates/'+id);out.push('tpl '+d.s);}
const c=await api('DELETE','/modules/'+C+'/records/'+S.contact);out.push('contact '+c.s);
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' ev5 cleanup: '+out.join(', ')+'\n');return out.join(', ');
