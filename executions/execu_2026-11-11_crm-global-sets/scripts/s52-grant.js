const P='11111111-1111-1111-1111-111111111103';
const before=arr((await api('GET','/iam/profiles/'+P+'/permissions')).j.data); fs.writeFileSync(RUN+'/baseline/profile-user-permissions.json',JSON.stringify(before,null,1));
const g=await api('POST','/iam/profiles/'+P+'/permissions',{permission_key:'crm:global_set:view',effect:'GRANT'}); LED('GRANT crm:global_set:view to CRM profile User '+SR(g)+' (to be removed)');
const after=arr((await api('GET','/iam/profiles/'+P+'/permissions')).j.data);
return {grant:SR(g), before:before.length, after:after.length, has:after.some(x=>x.permissionKey==='crm:global_set:view')};
