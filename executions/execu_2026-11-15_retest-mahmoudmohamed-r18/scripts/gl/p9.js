const o={}; const C='9d182dfa-05f3-4af7-9685-8615a2fbe537', B='3445ec4a-020e-4f12-b156-dd2de7610164';
o.ou=arr((await api('GET','/iam/org-units?app_key=desk')).j.data).map(x=>[x.orgUnitId.slice(0,8),x.name,x.parentId&&x.parentId.slice(0,8)]);
for (const p of ['/desk/agents?limit=200','/desk/agents/'+C,'/desk/agents/'+B]) { const r=await api('GET',p); if(p.includes('limit')){ o.list=r.s+' '+JSON.stringify(arr(r.j.data).filter(x=>[B,C].includes(x.user_id||x.userId||x.id)).map(x=>({w:(x.user_id||x.userId||x.id)===B?'B':'C', deps:(x.departments||x.department_ids||[]).map(d=>d.name||d)}))); } else o[p.slice(-6)]=r.s+' '+JSON.stringify(r.j&&r.j.data&&{deps:(r.j.data.departments||r.j.data.department_ids)}).slice(0,400); }
return o;
