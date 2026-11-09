const out={};
for(const p of ['/iam/me','/desk/integrations/crm/status','/desk/integrations/crm/config','/desk/integrations/crm/products','/settings/resolved?app_key=general&key=general.company.hierarchy.preference&scope_type=Org','/iam/roles','/iam/hierarchy','/iam/sharing-rules','/settings/data-sharing','/iam/me/subordinates']){
 const r=await api('GET',p); out[p]={s:r.s,t:r.t.slice(0,600)};}
return out;
