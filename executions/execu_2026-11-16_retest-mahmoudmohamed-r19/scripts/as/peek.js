var __AS="D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/as/";
eval(fs.readFileSync(__AS+'lib.js','utf8'));
const ids=made.tickets.slice(-4);const R={};
for(const id of ids){const r=await rec(id);const f=await api('GET','/desk/tickets/'+id+'/activity');R[id.slice(0,8)]={subj:r.subject,num:r.ticket_number,owner:nm(r.owner),skills:r.skills,feedS:f.s,feed:(f.t||'').slice(0,1500)};}
const raw=await recRaw(ids[0]);R.skillField=JSON.stringify((raw.data||[]).find(x=>x.field==='skills'));
return R;
