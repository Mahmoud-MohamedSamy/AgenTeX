const D='4853562a-0b4d-45cb-ba34-9f2118fcd32c';const s=(await api('GET','/desk/skills?department_id='+D)).j?.data;const L=Array.isArray(s)?s:(s?.skills||[]);
return {types:(await api('GET','/desk/skill-types?department_id='+D)).j?.data?.types,skills:L.map(x=>x.id+' '+x.name)};
