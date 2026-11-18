const C='9d182dfa-05f3-4af7-9685-8615a2fbe537', B='3445ec4a-020e-4f12-b156-dd2de7610164';
const ul=arr((await api('GET','/iam/users?app_key=desk&page_size=500&page=1')).j.data);
const ou=arr((await api('GET','/iam/org-units?app_key=desk')).j.data); const deps=arr((await api('GET','/desk/departments')).j.data);
const out={}; for (const [k,id] of [['B',B],['C',C]]) { const u=ul.find(x=>(x.userId||x.id)===id); if(!u){out[k]='not in desk users';continue;} const c={...u}; delete c.email; delete c.displayName; out[k]=JSON.stringify(c).slice(0,900); }
out.ou=ou.map(x=>x.orgUnitId.slice(0,8)+' '+x.name+' <'+(x.parentId||'').slice(0,8));
return out;
