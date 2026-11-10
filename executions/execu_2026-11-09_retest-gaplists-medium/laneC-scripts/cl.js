const fs=require('fs');const B='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/';
const L1=B+'ndc-2635/ledger.md',L2=B+'ndc-2636/ledger.md';const ts=()=>new Date().toISOString();
const TM='d120a6c2-2596-4254-968b-a1bcd3a000bf',TK='88e8ea44-1658-4df3-9930-d0902b91073d';
const TASK='3ae22630-3b08-4276-9c69-855c280c3639',TIX='307cc0ce-bbc5-4507-ad7f-71370e8b93a0';
const out={};
const dr=await api('DELETE',`/desk/tickets/${TIX}/drafts/mine`);out.draftDel=dr.s;fs.appendFileSync(L2,`- ${ts()} DELETE draft on ${TIX} → ${dr.s}\n`);
const a=await api('DELETE',`/modules/${TM}/records/${TASK}`);out.taskDel=a.s;fs.appendFileSync(L1,`- ${ts()} DELETE task ${TASK} → ${a.s}\n`);
const b=await api('DELETE',`/modules/${TK}/records/${TIX}`);out.tixDel=b.s;fs.appendFileSync(L2,`- ${ts()} DELETE ticket ${TIX} → ${b.s}\n`);
await sleep(3000);
const bin=arr((await api('GET','/audit/recycle-bin/items')).j);
const mine=bin.filter(i=>[TASK,TIX].some(x=>JSON.stringify(i).includes(x)));out.binMatches=mine.length;out.binKeys=Object.keys(bin[0]||{}).slice(0,12);
if(mine.length){const ids=mine.map(i=>i.id);const p=await api('POST','/audit/recycle-bin/delete',{ids});out.purge=p.s;fs.appendFileSync(L1,`- ${ts()} purge bin ids ${ids.join(',')} → ${p.s}\n`);fs.appendFileSync(L2,`- ${ts()} purge bin ids ${ids.join(',')} → ${p.s}\n`);}
await sleep(2000);
out.verifyTask=(await api('GET',`/modules/${TM}/records/${TASK}`)).s;out.verifyTix=(await api('GET',`/modules/${TK}/records/${TIX}`)).s;
const bin2=arr((await api('GET','/audit/recycle-bin/items')).j);out.binLeft=bin2.filter(i=>[TASK,TIX].some(x=>JSON.stringify(i).includes(x))||/QA RT 263/.test(JSON.stringify(i))).length;
fs.appendFileSync(L1,`- ${ts()} verify task GET → ${out.verifyTask}; bin matches left ${out.binLeft}\n`);fs.appendFileSync(L2,`- ${ts()} verify ticket GET → ${out.verifyTix}; bin matches left ${out.binLeft}\n`);
return out;
