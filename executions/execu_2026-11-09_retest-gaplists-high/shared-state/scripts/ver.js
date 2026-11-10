const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/ledger.md';
const log=s=>fs.appendFileSync(L,`- ${new Date().toISOString()} ${s}\n`);
const IDS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/ids.json';
const ids=fs.existsSync(IDS)?JSON.parse(fs.readFileSync(IDS,'utf8')):{};const save=()=>fs.writeFileSync(IDS,JSON.stringify(ids,null,1));
const SAMY='d23fb4e0-248d-41f6-af60-d28885a7007e',LEADS='841043e1-c078-41f9-8d6e-dfd61bee45c3',SALES='60aeb9ce-e602-4e95-aaef-de3ceba25a3e',TEAM2PFX='95754ee7',HR='5533f730-cd59-4432-970b-86090192787d',STAFF='8c38561e-d7e3-4550-9c1d-a97c10471eb4',USERP='11111111-1111-1111-1111-111111111103',SUPV='11111111-1111-1111-1111-111111111104';
const out={};const LK=['LA','LB','LC','LO','LD','LE','LF','AP1','AP2'];out.leads={};
for(const k of LK){out.leads[k]=(await api('GET',`/modules/${LEADS}/records/${ids[k]}`)).s;}
out.proc=(await api('GET',`/workflow/approval-processes/${ids.proc}`)).s;
const recIds=LK.map(k=>ids[k]).concat([ids.proc]);out.bin=arr((await api('GET','/audit/recycle-bin/items')).j).filter(i=>recIds.includes(i.record_id)).length;
const all=arr((await api('GET','/iam/users')).j.data);out.total=all.length;out.qaLeft=all.filter(u=>/^QA SS/.test(u.displayName||'')).map(u=>u.displayName+'|'+u.status+'|'+(u.invitationStatus||''));
const sm=all.find(u=>u.userId===SAMY);out.samy={prof:sm.profileNames,mgr:sm.reportingManagerId,ou:sm.orgUnitId.slice(0,8)};
out.leadsVis=(await api('GET',`/modules/${LEADS}`)).j.data.recordVisibility;
log(`VERIFY: leads ${JSON.stringify(out.leads)}; process ${out.proc}; bin items left ${out.bin}; users total ${out.total}; QA SS left ${out.qaLeft.length}; Samy profiles "${out.samy.prof}" manager ${out.samy.mgr}; Leads visibility ${out.leadsVis}`);
return out;
