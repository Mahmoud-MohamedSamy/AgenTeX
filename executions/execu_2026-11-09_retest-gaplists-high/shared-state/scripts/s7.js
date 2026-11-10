const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/ledger.md';
const log=s=>fs.appendFileSync(L,`- ${new Date().toISOString()} ${s}\n`);
const IDS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/ids.json';
const ids=fs.existsSync(IDS)?JSON.parse(fs.readFileSync(IDS,'utf8')):{};const save=()=>fs.writeFileSync(IDS,JSON.stringify(ids,null,1));
const SAMY='d23fb4e0-248d-41f6-af60-d28885a7007e',LEADS='841043e1-c078-41f9-8d6e-dfd61bee45c3',SALES='60aeb9ce-e602-4e95-aaef-de3ceba25a3e',TEAM2PFX='95754ee7',HR='5533f730-cd59-4432-970b-86090192787d',STAFF='8c38561e-d7e3-4550-9c1d-a97c10471eb4',USERP='11111111-1111-1111-1111-111111111103',SUPV='11111111-1111-1111-1111-111111111104';
const out={};
if(!ids.mgrSamy){const r=await api('PATCH',`/iam/users/${SAMY}/reporting-manager`,{reporting_manager_id:ids.userC});out.mgrSamy=r.s+' '+r.t.slice(0,200);if(r.s<300){ids.mgrSamy=true;save();log(`SETTING reporting manager of Mahmoud Samy → QA SS C (ORIGINAL: none) — restore to none`);}}
const u=arr((await api('GET','/iam/users?search=QA%20SS')).j.data).concat(arr((await api('GET','/iam/users?search=Mahmoud%20Samy')).j.data));out.mgrs=u.map(x=>x.displayName+' mgr='+(x.reportingManagerId||'none').slice(0,8));
return out;
