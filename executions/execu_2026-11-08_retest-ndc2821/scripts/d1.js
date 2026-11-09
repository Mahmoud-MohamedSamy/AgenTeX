const fs=require('fs');const IDS=JSON.parse(fs.readFileSync('../out/ids.json','utf8'));const o={};
const D=(await api('GET','/desk/departments?limit=200')).j.data;o.depts=D.length;o.newDept=D.filter(d=>/QA RT14/.test(d.name)).map(d=>({id:d.id,name:d.name,agents:(d.agent_user_ids||[]).length,tickets:d.ticket_count}));
const plan=[];const keep=[];const odd=[];
for(const d of D){const t=(await api('GET','/desk/skill-types?department_id='+d.id)).j.data.types;const s=(await api('GET','/desk/skills?department_id='+d.id)).j.data.skills;
 for(const x of t){if(/^QA (RT14|AS6 Type)/.test(x.name)){const used=s.filter(k=>k.type_id===x.id).map(k=>k.name);(used.length?keep:plan).push({dept:d.name,deptId:d.id,type:x.name,id:x.id,used:used.slice(0,4),usedN:used.length});}}
 for(const k of s)if(/QA RT14/.test(k.name))odd.push({dept:d.name,skill:k.name,id:k.id});}
fs.writeFileSync('../out/cleanup-plan.json',JSON.stringify({plan,keep,odd,newDept:o.newDept},null,1));
const cnt=a=>{const m={};for(const x of a){const k=x.type;m[k]=(m[k]||0)+1;}return m;};o.deleteCounts=cnt(plan);o.keep=keep.map(k=>k.dept+' / '+k.type+' / '+k.usedN+' skills: '+k.used.join(', '));o.qaSkills=odd;
const T='88e8ea44-1658-4df3-9930-d0902b91073d';const found=[];for(let p=1;p<=3;p++){const r=await api('GET','/modules/'+T+'/records?page='+p+'&page_size=100');const L=(r.j&&r.j.data&&(r.j.data.records||r.j.data))||[];for(const x of L){const sub=(x.data||[]).find?(x.data.find(f=>f.field==='subject')||{}).value:null;const v=sub&&(sub.value||sub);if(/rt14/i.test(String(v)))found.push({id:x.id,sub:String(v)});}if(!L.length)break;}o.tickets=found;fs.writeFileSync('../out/cleanup-tickets.json',JSON.stringify(found,null,1));
return o;
