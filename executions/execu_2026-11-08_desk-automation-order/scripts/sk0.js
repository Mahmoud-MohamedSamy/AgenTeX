const D='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6';
const s=(await api('GET','/desk/skills?department_id='+D)).j?.data;const L=Array.isArray(s)?s:(s?.skills||s?.items||[]);
const ty=(await api('GET','/desk/skill-types?department_id='+D)).t.slice(0,500);
const pref=(await api('GET','/desk/skills/preferences?department_id='+D)).t.slice(0,300);
return {n:L.length,active:L.filter(x=>x.is_active||x.status==='active').length,sample:JSON.stringify(L[0]).slice(0,700),ty,pref};
