const R={};const id='4e8aa6dd-c9c1-46fa-b04c-2736880d95e6';
const g=(await api('GET','/workflow/rules/'+id)).j?.data;R.version=g.version;
const b={name:g.name,description:g.description,moduleId:g.moduleId,departmentIds:g.departmentIds,trigger:g.trigger,criteria:g.criteria,mode:g.mode,isActive:false,version:g.version,actions:g.actions.map(a=>({type:a.type,order:a.order,delaySeconds:a.delaySeconds,url:a.url,method:a.method,bodyTemplate:a.bodyTemplate,timeoutSeconds:a.timeoutSeconds,headers:{'X-QA':'a\r\nInjected: 1'}}))};
for(const m of ['PATCH','PUT']){const p=await api(m,'/workflow/rules/'+id,b);R[m]=short(p);if(p.s!==405)break;}
const g2=(await api('GET','/workflow/rules/'+id)).j?.data;R.after={headers:g2.actions[0].headers,version:g2.version};
// roles / teams for 2999 positive controls
for(const p of ['/iam/roles','/iam/org-units','/desk/teams','/iam/teams','/iam/profiles']){const r=await api('GET',p);R['ls '+p]=r.s+' '+arr(r.j?.data).slice(0,2).map(x=>x.id+':'+x.name).join(', ');}
return R;
