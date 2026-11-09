const fs=require('fs');const b=JSON.parse(fs.readFileSync('../../execu_2026-11-06_desk-assignment-skills/out/baseline.json','utf8'));
const LS=x=>{if(Array.isArray(x))return x;if(x&&typeof x==='object')for(const k of ['types','skills','data','j','items','results']){if(x[k]){const r=LS(x[k]);if(r.length||Array.isArray(x[k]))return r;}}return [];};const o={};const D=arr((await api('GET','/desk/departments?limit=200')).j.data);o.depts=D.length;
const oldT={};for(const t of LS(b.skillTypes))oldT[t.id]=t.name;o.oldTypes=Object.values(oldT);
const pdk=Object.keys(b.perDept||{});o.baselineDepts=pdk.length;o.baseSample=JSON.stringify(b.perDept[pdk[0]]).slice(0,300);
const lists={},typeOwner={};let skillTotal=0,noType=0,foreign=[],changed=[],lost=[],compared=0;
for(const d of D){const t=await api('GET','/desk/skill-types?department_id='+d.id);const L=LS(t.j);lists[d.name]=L.map(x=>x.name).join(' > ');for(const x of L){if(typeOwner[x.id])foreign.push('type id shared '+x.name);typeOwner[x.id]=d.id;}
 const s=await api('GET','/desk/skills?department_id='+d.id);const SL=(s.j&&s.j.data&&s.j.data.skills)||[];skillTotal+=SL.length;
 const names=Object.fromEntries(L.map(x=>[x.id,x.name]));const pb=b.perDept[d.id]||b.perDept[d.name];const base=pb&&pb.skills&&pb.skills.data?pb.skills.data.skills:null;
 for(const k of SL){if(!k.type_id)noType++;else if(!names[k.type_id])foreign.push(d.name+': '+k.name);
  const old=base&&base.find(x=>x.id===k.id);if(old){compared++;const was=old.type_id?oldT[old.type_id]:null,now=k.type_id?names[k.type_id]:null;if(was!==now)changed.push(k.name+': '+was+' -> '+now);}}
 if(base)for(const x of base)if(!SL.find(k=>k.id===x.id))lost.push(d.name+': '+x.name);
}
const groups={};for(const[k,v]of Object.entries(lists))(groups[v]=groups[v]||[]).push(k);
o.listGroups=Object.entries(groups).map(([k,v])=>({list:k,count:v.length,depts:v.length<6?v:undefined}));
Object.assign(o,{skillTotal,noType,foreign:foreign.slice(0,10),foreignN:foreign.length,compared,changed:changed.slice(0,10),changedN:changed.length,lost:lost.slice(0,20),lostN:lost.length});
fs.writeFileSync('../out/b2-lists.json',JSON.stringify(lists,null,1));return o;
