eval(fs.readFileSync('lib-as.js','utf8'));const M=JSON.parse(fs.readFileSync('../e1.json','utf8'));const out={};
for(const [k,id] of [['#3945 normal',M.c1],['#3946 blueprint',M.c2]]){const o=await rec(id);const f=await feed(id);out[k]={status:o.status,events:f.reverse().map(e=>(e.occurred_at||'').slice(11,19)+' '+e.action).filter(x=>!/department_changed|created|sla\.|skill|workflow|owner|auto_assigned/.test(x))};}
return out;
