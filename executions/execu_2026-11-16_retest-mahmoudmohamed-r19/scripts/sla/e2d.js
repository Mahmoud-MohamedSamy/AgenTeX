eval(fs.readFileSync('sla/lib.js','utf8'));const id=CFG.e3.id;
const g=await api('GET','/modules/'+T+'/records/'+id);const s=await sla(id);const fd=await feed(id);
return {g:g.s, data:(g.j?.data?.data||[]).filter(z=>['ticket_number','owner','description','department'].includes(z.field)).map(z=>z.field+'='+(z.field==='owner'?(z.value.value===SAMY?'Samy':z.value.value):z.value.value)), sla:s, acts:arr(fd?.data).map(x=>x.action+' '+x.occurred_at)};
