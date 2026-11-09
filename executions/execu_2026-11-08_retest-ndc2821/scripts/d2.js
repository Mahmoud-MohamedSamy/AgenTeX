const fs=require('fs');const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' CLEANUP '+m+'\n');const IDS=JSON.parse(fs.readFileSync('../out/ids.json','utf8'));const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const plan=JSON.parse(fs.readFileSync('../out/cleanup-plan.json','utf8'));const o={fail:[]};const NEW='89a507f8-c2ed-422f-8d83-c93a91da715e';const SK='7190bde1-b65b-41e9-8cad-f368edb16682';
const TK=['c673c1e1-11d2-4d0d-ba3f-2316a25ed798','4bad326c-d2c8-4b72-b71b-50c413858bcf','8446d046-c298-4733-8e10-dd35840eedd4','749be659-b8d6-4578-a460-d24c04a390b0','20fa2b15-1be7-4be0-a3e4-0b7c07cd3304'];
const del=async(p,label)=>{const r=await api('DELETE',p);if(r.s===429)throw new Error('429 stop at '+label);if(r.s>=300&&r.s!==404)o.fail.push(label+' '+r.s+' '+((r.j&&r.j.error&&r.j.error.message)||''));return r.s;};
o.skill=await del('/desk/skills/'+SK+'?department_id='+IDS.DB,'skill beta');LED('skill QA RT14 skill beta: '+o.skill);
const beta=plan.keep.find(k=>k.type==='QA RT14 beta2');if(beta){o.beta=await del('/desk/skill-types/'+beta.id,'type beta2');LED('type QA RT14 beta2: '+o.beta);}
let n=0;for(const x of plan.plan){const s=await del('/desk/skill-types/'+x.id,x.dept+' / '+x.type);if(s<300)n++;}o.typesDeleted=n+' of '+plan.plan.length;LED('types deleted '+o.typesDeleted+' (QA RT14 alpha, QA AS6 Type, QA AS6 Type3 where unused)');
let tk=0;for(const id of TK){const s=await del('/modules/'+T+'/records/'+id,'ticket '+id.slice(0,8));if(s<300)tk++;}o.tickets=tk;LED('tickets deleted '+tk+' of 5');
const a=await api('PATCH','/desk/departments/'+NEW,{name:'QA RT14 Dept New',agent_user_ids:[]});o.deptAgents=a.s;o.dept=await del('/desk/departments/'+NEW,'department');LED('department QA RT14 Dept New: agents '+a.s+', delete '+o.dept);
return o;
