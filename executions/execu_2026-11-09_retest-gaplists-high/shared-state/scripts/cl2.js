const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/ledger.md';
const log=s=>fs.appendFileSync(L,`- ${new Date().toISOString()} ${s}\n`);
const IDS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/ids.json';
const ids=fs.existsSync(IDS)?JSON.parse(fs.readFileSync(IDS,'utf8')):{};const save=()=>fs.writeFileSync(IDS,JSON.stringify(ids,null,1));
const SAMY='d23fb4e0-248d-41f6-af60-d28885a7007e',LEADS='841043e1-c078-41f9-8d6e-dfd61bee45c3',SALES='60aeb9ce-e602-4e95-aaef-de3ceba25a3e',TEAM2PFX='95754ee7',HR='5533f730-cd59-4432-970b-86090192787d',STAFF='8c38561e-d7e3-4550-9c1d-a97c10471eb4',USERP='11111111-1111-1111-1111-111111111103',SUPV='11111111-1111-1111-1111-111111111104';
const out={};const OWN='97be04b6-0a08-4883-aa51-e1650b11cab7';
const p=(await api('GET',`/workflow/approval-processes/${ids.proc}`)).j.data;
const adm=Object.assign({},p.admins,{adminUserIds:[OWN]});
const u=await api('PATCH',`/workflow/approval-processes/${ids.proc}`,{admins:adm});out.patchAdmins=u.s+' '+u.t.slice(0,150);if(u.s<300)log(`UPDATED own QA approval process admins → ndc-staging-owner (to resolve pending QA requests)`);
for(const k of ['AP1','AP2']){const a=(await api('GET',`/workflow/approvals/records/${LEADS}/${ids[k]}`)).j;const inst=a&&a.data&&a.data.instanceId;out[k+'inst']=inst;
 if(inst){let r=await api('POST',`/workflow/approvals/${inst}/takeover/reject`,{comment:'QA cleanup'});if(r.s>=300)r=await api('POST',`/workflow/approvals/${inst}/reject`,{comment:'QA cleanup'});out[k+'reject']=r.s+' '+r.t.slice(0,150);if(r.s<300)log(`REJECTED (admin takeover) approval ${inst} on ${k} for cleanup`);}
 const d=await api('DELETE',`/modules/${LEADS}/records/${ids[k]}`);out[k+'del']=d.s+' '+d.t.slice(0,120);if(d.s<300){ids['del'+k]=true;save();log(`DELETED lead ${k} ${ids[k]} (${d.s})`);}}
const pr=await api('DELETE',`/workflow/approval-processes/${ids.proc}`);out.proc=pr.s+' '+pr.t.slice(0,150);if(pr.s<300){ids.procDeleted=true;save();log(`DELETED approval process ${ids.proc} (${pr.s})`);}
await sleep(3000);const bin=arr((await api('GET','/audit/recycle-bin/items')).j).filter(i=>[ids.AP1,ids.AP2,ids.proc].includes(i.record_id));out.bin=bin.length;
if(bin.length){const r=await api('POST','/audit/recycle-bin/delete',{ids:bin.map(i=>i.id)});out.purge=r.s;if(r.s<300)log(`PURGED ${bin.length} recycle-bin items by id`);}
return out;
