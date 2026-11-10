const fs=require('fs');const L='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/ledger.md';
const log=s=>fs.appendFileSync(L,`- ${new Date().toISOString()} ${s}\n`);
const IDS='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-09_retest-gaplists-high/shared-state/ids.json';
const ids=fs.existsSync(IDS)?JSON.parse(fs.readFileSync(IDS,'utf8')):{};const save=()=>fs.writeFileSync(IDS,JSON.stringify(ids,null,1));
const SAMY='d23fb4e0-248d-41f6-af60-d28885a7007e',LEADS='841043e1-c078-41f9-8d6e-dfd61bee45c3',SALES='60aeb9ce-e602-4e95-aaef-de3ceba25a3e',TEAM2PFX='95754ee7',HR='5533f730-cd59-4432-970b-86090192787d',STAFF='8c38561e-d7e3-4550-9c1d-a97c10471eb4',USERP='11111111-1111-1111-1111-111111111103',SUPV='11111111-1111-1111-1111-111111111104';
const out={};const S=v=>({kind:'string',value:v});
for(const k of ['LO','LD','LA','LB']){const g=await api('GET',`/modules/${LEADS}/records/${ids[k]}`);out['get'+k]=g.s;}
const p=await api('PATCH',`/modules/${LEADS}/records/${ids.LO}`,{data:[{field:'single_line_3_9',value:S('QA edited by Samy')}]});out.patchLO=p.s+' '+p.t.slice(0,200);
if(p.s<300)log(`NOTE Samy PATCH on lead LO succeeded (${p.s}) under public_read_only`);
const l=await api('GET',`/modules/${LEADS}/records?pageSize=50&q=QA%20SS%202417`);out.listCount=arr(l.j&&l.j.data).length;
return out;
