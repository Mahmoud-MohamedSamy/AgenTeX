const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/bugs-draft/ledger.md';const ts=()=>new Date().toISOString();
const R=[['f7e488b5-0232-42fd-811c-1f24356af653','98f86824-ecb2-4a2a-acbe-9fa12435cd27','call'],['d120a6c2-2596-4254-968b-a1bcd3a000bf','d520655a-3a31-4796-bd33-b639e4456e56','task'],['88e8ea44-1658-4df3-9930-d0902b91073d','372b88df-6733-4c61-a774-0202a0148fd5','ticket'],['43004ce2-577f-4eda-b00a-0750fe40c3d4','daf6afa2-d952-41f6-afbb-f7223e49408a','contact']];
const out={};
const tl=await api('GET','/modules/d120a6c2-2596-4254-968b-a1bcd3a000bf/records?pageSize=1');out.ownerTaskTotal=tl.j&&tl.j.meta&&tl.j.meta.total_count;
const d0=await api('DELETE','/desk/tickets/372b88df-6733-4c61-a774-0202a0148fd5/drafts/mine');out.draft=d0.s;
for(const [m,id,k] of R){const d=await api('DELETE',`/modules/${m}/records/${id}`);out[k]=d.s;fs.appendFileSync(L,`- ${ts()} DELETE ${k} ${id} → ${d.s}\n`);}
await sleep(3000);
const ids=R.map(r=>r[1]);const bin=arr((await api('GET','/audit/recycle-bin/items')).j);const mine=bin.filter(i=>ids.some(x=>JSON.stringify(i).includes(x)));out.binMatches=mine.length;
if(mine.length){const b=mine.map(i=>i.id);const p=await api('POST','/audit/recycle-bin/delete',{ids:b});out.purge=p.s;fs.appendFileSync(L,`- ${ts()} purge bin ids ${b.join(',')} → ${p.s}\n`);}
await sleep(2000);
out.verify=[];for(const [m,id,k] of R)out.verify.push(k+' '+(await api('GET',`/modules/${m}/records/${id}`)).s);
const bin2=arr((await api('GET','/audit/recycle-bin/items')).j);out.binLeft=bin2.filter(i=>ids.some(x=>JSON.stringify(i).includes(x))||/QA RT BUG/.test(JSON.stringify(i))).length;
fs.appendFileSync(L,`- ${ts()} verify ${out.verify.join(', ')}; bin matches left ${out.binLeft}\n`);
return out;
