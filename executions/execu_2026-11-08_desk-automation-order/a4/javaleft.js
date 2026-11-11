const L=arr2((await api('GET','/workflow/rules?take=300')).j?.data);const q=L.filter(r=>/^QA WF /.test(r.name)&&r.createdAt>'2026-11-11');
const out={total:L.length,javaToday:q.map(r=>r.name+' '+r.createdAt.slice(11,19)),del:{}};
for(const r of q){out.del[r.name]=(await api('DELETE','/workflow/rules/'+r.id)).s;fs.appendFileSync('../ledger.md',`- ${new Date().toISOString()} A4 Java leftover rule "${r.name}" ${r.id} deleted\n`);}
const A=arr2((await api('GET','/workflow/actions?take=200')).j?.data).filter(a=>/^QA WF /.test(a.name)&&a.createdAt>'2026-11-11');out.actions=A.map(a=>a.name);
for(const a of A)out.del['action '+a.name]=(await api('DELETE','/workflow/actions/'+a.id)).s;
return out;
