const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/ledger.md';
const log=s=>fs.appendFileSync(L,`- ${new Date().toISOString()} ${s}\n`);
const IDS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/ids.json';
const ids=fs.existsSync(IDS)?JSON.parse(fs.readFileSync(IDS,'utf8')):{};const save=()=>fs.writeFileSync(IDS,JSON.stringify(ids,null,1));
const SAMY='d23fb4e0-248d-41f6-af60-d28885a7007e',LEADS='841043e1-c078-41f9-8d6e-dfd61bee45c3',SALES='60aeb9ce-e602-4e95-aaef-de3ceba25a3e',TEAM2PFX='95754ee7',HR='5533f730-cd59-4432-970b-86090192787d',STAFF='8c38561e-d7e3-4550-9c1d-a97c10471eb4',USERP='11111111-1111-1111-1111-111111111103',SUPV='11111111-1111-1111-1111-111111111104';
const out={};
const m=(await api('GET',`/modules/${LEADS}`)).j.data;out.before={vis:m.recordVisibility,rv:m.rowVersion};ids.leadsVisBefore=m.recordVisibility;save();
const r=await api('PUT',`/modules/${LEADS}`,{recordVisibility:'public_read_only',rowVersion:m.rowVersion});out.put=r.s+' '+r.t.slice(0,300);
const m2=(await api('GET',`/modules/${LEADS}`)).j.data;out.after={vis:m2.recordVisibility,rv:m2.rowVersion};
if(m2.recordVisibility!==m.recordVisibility){ids.leadsVisChanged=true;save();log(`SETTING Leads module recordVisibility ${m.recordVisibility} → ${m2.recordVisibility} (PUT ${r.s}); ORIGINAL "${m.recordVisibility}" — restore`);}
else log(`TRY Leads recordVisibility → public_read_only: PUT ${r.s}, value stays "${m2.recordVisibility}" (no change)`);
return out;
