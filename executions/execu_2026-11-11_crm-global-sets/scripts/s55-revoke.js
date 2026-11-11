const P='11111111-1111-1111-1111-111111111103'; const K='crm:global_set:view'; const t=[];
for (const [m,p,b] of [['DELETE','/iam/profiles/'+P+'/permissions/'+encodeURIComponent(K),null],['DELETE','/iam/profiles/'+P+'/permissions?permission_key='+encodeURIComponent(K),null],['POST','/iam/profiles/'+P+'/permissions',{permission_key:K,effect:'REVOKE'}]]) {
  const has=arr((await api('GET','/iam/profiles/'+P+'/permissions')).j.data).some(x=>x.permissionKey===K); if(!has) break; const r=await api(m,p,b||undefined); t.push(m+' '+p.replace(P,'{p}')+' → '+SR(r)); }
const now=arr((await api('GET','/iam/profiles/'+P+'/permissions')).j.data); const base=JSON.parse(fs.readFileSync(RUN+'/baseline/profile-user-permissions.json','utf8'));
const same=JSON.stringify(now.map(x=>x.permissionKey+':'+x.effect).sort())===JSON.stringify(base.map(x=>x.permissionKey+':'+x.effect).sort());
LED('REVOKE crm:global_set:view from User: '+t.join('; ')+' → matches baseline: '+same);
return {t, count:now.length, same};
