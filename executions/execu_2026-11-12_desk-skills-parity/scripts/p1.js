const D='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6';
const out={};
for (const p of [`/desk/skills?department_id=${D}`,`/desk/skill-types?department_id=${D}`,`/desk/skill-preferences?department_id=${D}`,`/desk/skills`,`/desk/skill-preferences`]) {
  const r=await api('GET',p); out[p]={s:r.s, t:r.t.slice(0,1500)};
}
return out;
