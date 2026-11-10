const fs=require('fs');const LG='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-medium/ndc-2628/ledger.md';const LED=s=>fs.appendFileSync(LG,'- '+new Date().toISOString()+' '+s+'\n');
const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const o={};
let r=await api('DELETE','/files/30084b09-79d4-49c8-8cdd-99ca04f45bbf');o.file=r.s+' '+r.t.slice(0,100);LED('CLEANUP DELETE file object 30084b09 (txt) → '+r.s);
for(const p of ['/modules/'+L+'/import/history','/modules/'+L+'/imports','/modules/'+L+'/import/sessions','/modules/'+L+'/import/e122c27a-14a9-48b4-864f-c824d5438f80']){r=await api('GET',p);o[p.slice(-30)]=r.s+' '+(r.s<300?JSON.stringify(r.j.data).slice(0,250):'');}
return o;
