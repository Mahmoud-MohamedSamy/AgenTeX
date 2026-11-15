// OR-03b: workflow sets priority low, then RecalculateTicketSkills; skill sk1 needs priority low. Does the skill (and skill RR) arrive in the same event?
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));
const R={};const off=async(...ids)=>{for(const id of ids)try{await setA(id,false);}catch(e){}};
const sl=(await api('GET','/desk/skills?department_id='+DA)).j?.data;const SL=Array.isArray(sl)?sl:(sl?.skills||[]);const S1=SL.find(s=>s.name==='QA AS6 sk1');const SO=JSON.parse(fs.readFileSync('../pb-skill-orig.json','utf8'));
try{await cs(R,'OR-03b workflow + Recalculate skills',async()=>{const k='PB03b'+U;
 await api('PUT','/desk/skills/'+S1.id+'?department_id='+DA,{name:S1.name,type_id:S1.type_id,description:S1.description,is_active:true,criteria:{conditions:[{field_key:'description',operator:'contains',value:k},{field_key:'priority',operator:'equals',value:'low'}],pattern:'1 and 2'},agent_ids:S1.agent_ids});
 await wrule('OR03b',{kind:'RecordCreated'},wcon(k),[{type:'FieldUpdate',fieldUpdates:{priority:{kind:'string',stringValue:'low'}}},{type:'RecalculateTicketSkills'}]);
 const id=await ptk(k);await sleep(15000);const o=await rec(id);return {priority:o.priority,skills:await skillsOf(id),owner:nm(o.owner),execs:await execsOf(id),feed:await feedS(id)};});
}finally{const o=[];for(const x of SO)o.push((await api('PUT','/desk/skills/'+x.id+'?department_id='+DA,{name:x.name,type_id:x.type_id,description:x.description,is_active:x.is_active,criteria:x.criteria,agent_ids:x.agent_ids})).s);R.skillRestore=o;}
fs.writeFileSync('../pb1d-result.json',JSON.stringify(R,null,1));return R;
