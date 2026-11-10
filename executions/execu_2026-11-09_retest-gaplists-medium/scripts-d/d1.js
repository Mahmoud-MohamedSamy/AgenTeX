const out={};
const deps=arr((await api('GET','/desk/departments')).j);out.depts=deps.length;
const d0=deps.find(d=>/QA AS6 Dept A/.test(d.name))||deps[0];out.dep={id:d0.id,name:d0.name};
for(const p of ['/desk/skills','/desk/skills?department_id='+d0.id,'/desk/skill-types?department_id='+d0.id,'/desk/skill-preferences','/desk/skill-preferences?department_id='+d0.id,'/desk/skill-definitions','/desk/skill-settings','/desk/agent-skills','/desk/approval-processes','/desk/approvals','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/approval-processes']){const r=await api('GET',p);out[p]={s:r.s,n:arr(r.j).length,keys:r.j&&r.j.data&&!Array.isArray(r.j.data)?Object.keys(r.j.data).slice(0,10):undefined,sample:r.s<300?JSON.stringify(arr(r.j)[0]||r.j.data||{}).slice(0,300):r.t.slice(0,100)};}
return out;
