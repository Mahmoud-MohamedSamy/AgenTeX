const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/ledger.md';
const log=s=>fs.appendFileSync(L,`- ${new Date().toISOString()} ${s}\n`);
const IDS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/ids.json';
const ids=fs.existsSync(IDS)?JSON.parse(fs.readFileSync(IDS,'utf8')):{};const save=()=>fs.writeFileSync(IDS,JSON.stringify(ids,null,1));
const SAMY='d23fb4e0-248d-41f6-af60-d28885a7007e',LEADS='841043e1-c078-41f9-8d6e-dfd61bee45c3',SALES='60aeb9ce-e602-4e95-aaef-de3ceba25a3e',TEAM2PFX='95754ee7',HR='5533f730-cd59-4432-970b-86090192787d',STAFF='8c38561e-d7e3-4550-9c1d-a97c10471eb4',USERP='11111111-1111-1111-1111-111111111103',SUPV='11111111-1111-1111-1111-111111111104';
const out={};const S=v=>({kind:'string',value:v});
const prof=async()=>arr((await api('GET','/iam/users?search=Mahmoud%20Samy')).j.data).filter(u=>u.userId===SAMY).map(u=>u.profileNames)[0];
out.before=await prof();
if(!ids.samyProfChanged){const r=await api('POST',`/iam/users/${SAMY}/profiles`,{profile_id:SUPV,replace:true});out.assign=r.s+' '+r.t.slice(0,200);
 if(r.s<300){ids.samyProfChanged=true;save();log(`SETTING Mahmoud Samy CRM profile User → Supervisor (replace:true) ${r.s}; ORIGINAL profiles "${out.before}" — restore User`);}}
out.after=await prof();
const mk=[['LA',ids.userA,'owned by QA SS A (Sales/Team 2, sub-unit)'],['LB',ids.userB,'owned by QA SS B (HR, sibling unit)'],['LC',ids.userC,'owned by QA SS C (Sales, same unit)'],['LO',null,'owned by ndc-staging-owner (higher rank)']];
for(const [k,own,why] of mk){if(ids[k])continue;const d=[{field:'first_name',value:S('QA SS 2417 '+k)},{field:'single_line_3_9',value:S('QA')}];if(own)d.push({field:'owner',value:S(own)});
 const r=await api('POST',`/modules/${LEADS}/records`,{data:d});const id=r.j&&r.j.data&&(r.j.data.id||r.j.data.recordId);out[k]=r.s+' '+(id||r.t.slice(0,250));
 if(id){ids[k]=id;save();log(`CREATED lead "QA SS 2417 ${k}" ${id} ${why}`);}}
// read back owners
for(const k of ['LA','LB','LC','LO']){if(!ids[k])continue;const r=await api('GET',`/modules/${LEADS}/records/${ids[k]}`);const d=r.j&&r.j.data&&r.j.data.data||[];const ow=(Array.isArray(d)?d.find(x=>x.field==='owner'):d.owner);out['own'+k]=JSON.stringify(ow&&(ow.value||ow)).slice(0,80);}
return out;
