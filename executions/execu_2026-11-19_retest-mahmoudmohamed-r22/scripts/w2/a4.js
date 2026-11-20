eval(fs.readFileSync('w2/lib.js','utf8'));const o={};
for(const id of ['da9ce044-3f82-4bcf-bc3e-961c5b0b88fd','da96e91b-3f0c-4c56-a4ba-7fb13a52055a']){const ex=(await execsRaw(id)).filter(e=>e.ruleId==='9d0f9dbf-0220-40e5-acbc-bc7b2166c174');o[id.slice(0,8)]=ex.map(e=>e.evaluatedAt.slice(11,19)+' '+e.id+' corr '+e.correlationId.slice(0,8));o[id.slice(0,8)+'num']=(await api('GET','/desk/tickets/'+id)).j?.data?.ticket_number;}
return o;
