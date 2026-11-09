// H-09 edges: no skills, skill nobody holds (sk3 inactive, so use an unheld active skill if any), already owned, offline not allowed
eval(require('fs').readFileSync('lib.js','utf8'));
const NM={};NM[IDS.A1]='A1';NM[IDS.A2]='A2';NM[IDS.A3]='A3';NM[IDS.O]='O';const nm=x=>x?(NM[x]||String(x).slice(0,8)):'-';
const SA=async id=>{const r=await api('POST','/desk/tickets/'+id+'/skills/assign',{});return {s:r.s,d:JSON.stringify(r.j&&(r.j.data||r.j.error)).slice(0,200),owner:nm((await own(id)).owner)};};
const o={};const pr0=(await api('GET','/desk/departments/'+IDS.DA+'/round-robin-preferences')).j.data;
// offline not allowed, everyone offline
const t0=await mkTicket('QA AS6 SKR QA AS6 SK2 h09 offline',IDS.DA,{},'H-09 edge');await W(3000);o.offlineNotAllowed=await SA(t0.id);
await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',{...pr0,assign_to_offline_agents:true});
const t1=await mkTicket('QA AS6 h09 no skills',IDS.DA,{},'H-09 edge');await W(3000);o.noSkills={skills:(await getT(t1.id)).skills,...await SA(t1.id)};
const t2=await mkTicket('QA AS6 SKR QA AS6 SK2 h09 owned',IDS.DA,{owner:IDS.A1},'H-09 edge');await W(3000);o.owned={before:nm((await own(t2.id)).owner),...await SA(t2.id)};
// skill nobody holds: agents of SK1?
const ag=(await api('GET','/desk/agent-skills?department_id='+IDS.DA)).j.data.agents.map(a=>[nm(a.user_id),JSON.stringify(a.skills).slice(0,120)]);o.agentSkills=ag;
await api('PUT','/desk/departments/'+IDS.DA+'/round-robin-preferences',pr0);LED('H-09 edges: Dept A offline agents ON temporarily, restored');
return o;
