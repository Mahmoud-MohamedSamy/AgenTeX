const D='0c0e4194-8a21-44d8-a7cb-2daa011499b7', T='81b2c9de-b75c-412b-ad6a-eab6c787de82';
const o={ids:[]};
const g=await api('GET',`/desk/skills?department_id=${D}`); let sk=g.j.data.skills; let active=sk.filter(s=>s.is_active).length; o.start=active;
for(let i=1;i<=40&&active<31;i++){const n=`QA SK12 Lim${String(i).padStart(2,'0')}`;
 const r=await api('POST',`/desk/skills?department_id=${D}`,{name:n,type_id:T,is_active:true,criteria:{conditions:[{field_key:'subject',operator:'contains',value:'QASK12Lim'+i}],pattern:null}});
 const id=r.j?.data?.id; if(r.s===201){track('skill',id,n);active++;} else {o.refused=[n,active,r.s,r.t.slice(0,300)];break;}}
const ri=await api('POST',`/desk/skills?department_id=${D}`,{name:'QA SK12 LimInact',type_id:T,is_active:false,criteria:null}); o.inactAtLimit=[ri.s,ri.j?.data?.id||ri.t.slice(0,200)];
if(ri.j?.data?.id){track('skill',ri.j.data.id,'QA SK12 LimInact'); const one=(await api('GET',`/desk/skills?department_id=${D}`)).j.data.skills.find(s=>s.id===ri.j.data.id);
 const ra=await api('PUT',`/desk/skills/${ri.j.data.id}`,{...one,is_active:true}); o.activateAtLimit=[ra.s,ra.t.slice(0,300)];}
return o;
