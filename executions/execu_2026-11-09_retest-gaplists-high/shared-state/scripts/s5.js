const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/ledger.md';
const log=s=>fs.appendFileSync(L,`- ${new Date().toISOString()} ${s}\n`);
const IDS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/ids.json';
const ids=fs.existsSync(IDS)?JSON.parse(fs.readFileSync(IDS,'utf8')):{};const save=()=>fs.writeFileSync(IDS,JSON.stringify(ids,null,1));
const SAMY='d23fb4e0-248d-41f6-af60-d28885a7007e',LEADS='841043e1-c078-41f9-8d6e-dfd61bee45c3',SALES='60aeb9ce-e602-4e95-aaef-de3ceba25a3e',TEAM2PFX='95754ee7',HR='5533f730-cd59-4432-970b-86090192787d',STAFF='8c38561e-d7e3-4550-9c1d-a97c10471eb4',USERP='11111111-1111-1111-1111-111111111103',SUPV='11111111-1111-1111-1111-111111111104';
const out={};const S=v=>({kind:'string',value:v});const AIP='1f415aab-7727-934d-9a10-a7e420f3fae9';
const mk=[['D','qass-d',ids.T2,'Sales/Team 2 (sub-unit)'],['E','qass-e',HR,'HR (sibling unit)'],['F','qass-f',SALES,'Sales (same unit)']];
for(const [k,tag,o,why] of mk){if(!ids['user'+k]){const r=await api('POST','/iam/users/invite',{email:`mmohamed+${tag}@anyware.software`,profile_id:AIP,display_name:`QA SS ${k}`,org_unit_id:o});
 const d=r.j&&r.j.data;out['invite'+k]=r.s+' '+(r.s<300?'ok':r.t.slice(0,250));if(r.s<300){ids['user'+k]=d.user_id;ids['inv'+k]=d.invitation_id;save();log(`CREATED invite QA SS ${k} mmohamed+${tag}@anyware.software profile AI Agent (rank 10) ou ${why} → user ${d.user_id} invitation ${d.invitation_id}`);}}
 if(ids['user'+k]&&!ids['L'+k]){const r=await api('POST',`/modules/${LEADS}/records`,{data:[{field:'first_name',value:S('QA SS 2417 L'+k)},{field:'single_line_3_9',value:S('QA')},{field:'owner',value:S(ids['user'+k])}]});const id=r.j&&r.j.data&&r.j.data.id;out['L'+k]=r.s+' '+(id||r.t.slice(0,200));if(id){ids['L'+k]=id;save();log(`CREATED lead "QA SS 2417 L${k}" ${id} owned by QA SS ${k} (${why})`);}}}
const all=arr((await api('GET','/iam/users?search=QA%20SS')).j.data);out.qa=all.map(u=>u.displayName+'|'+u.status+'|'+u.profileNames+'|'+(u.orgUnitId||'').slice(0,8));
return out;
