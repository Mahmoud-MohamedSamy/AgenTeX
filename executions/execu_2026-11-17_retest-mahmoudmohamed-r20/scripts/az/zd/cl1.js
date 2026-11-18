async (page) => { EVAL
const o={};const r=await z('GET','/api/v1/tickets/search?subject='+encodeURIComponent('QA RT20 AZ*')+'&limit=50');const ids=(r.j?.data||[]).map(x=>x.id);o.n=ids.length;
o.trash=(await z('POST','/api/v1/tickets/moveToTrash',{ticketIds:ids})).s;
for(const s of ['1499272000000485299','1499272000000485312'])o['sk'+s.slice(-3)]=(await z('DELETE','/api/v1/skills/'+s)).s;
o.type=(await z('DELETE','/api/v1/skillTypes/1499272000000485296')).s;
const c=await z('GET','/api/v1/contacts/search?lastName='+encodeURIComponent('QA RT20 AZ')+'&limit=20');const cids=(c.j?.data||[]).map(x=>x.id);o.contacts=cids.length;if(cids.length)o.ctrash=(await z('POST','/api/v1/contacts/moveToTrash',{contactIds:cids})).s;
return o;}
