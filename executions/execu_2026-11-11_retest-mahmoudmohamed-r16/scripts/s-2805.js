const LED=s=>fs.appendFileSync('ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+s+'\n'); const o={};
let r = await api('POST','/desk/departments',{name:'QA RT16 2805 dept', agent_user_ids:['97be04b6-0a08-4883-aa51-e1650b11cab7']}); o.dept=r.s+' '+r.t.slice(0,200); const did=r.j&&r.j.data&&r.j.data.id; if(!did) return o; LED('department "QA RT16 2805 dept" '+did);
r = await api('GET','/desk/skills?department_id='+did); o.before=r.s+' '+JSON.stringify({skills:(r.j.data.skills||[]).map(x=>x.name), types:(r.j.data.types||[]).map(x=>[x.id,x.name])});
const typeId = r.j.data.types && r.j.data.types[0] && r.j.data.types[0].id;
r = await api('POST','/desk/skills',{department_id:did, name:'QA RT16 2805 skill', skill_type_id:typeId}); o.skill=r.s+' '+r.t.slice(0,300); const sid=r.j&&r.j.data&&r.j.data.id; if(sid) LED('skill "QA RT16 2805 skill" '+sid);
fs.writeFileSync('out/2805.json', JSON.stringify({did,sid,typeId})); return o;
