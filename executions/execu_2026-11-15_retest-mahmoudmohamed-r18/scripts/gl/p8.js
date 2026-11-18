const o={};
o.roles=(await api('GET','/iam/roles?app_key=desk')).t.slice(0,300);
o.ou=(await api('GET','/iam/org-units?app_key=desk')).t.slice(0,300);
const a=await api('GET','/desk/departments/2a73bbc0-efb3-4250-bf9b-2fdc98236794/agents?limit=100'); o.mk=a.s+' '+a.t.slice(0,600);
return o;
