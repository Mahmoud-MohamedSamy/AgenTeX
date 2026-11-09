const all=async app=>{let r=[],p=1,meta=null;for(;p<40;p++){const x=await api('GET',`/iam/users?app_key=${app}&page=${p}&pageSize=100&page_size=100`);const d=arr(x.j&&x.j.data);meta=x.j&&x.j.meta;r=r.concat(d);if(d.length===0||(meta&&meta.total&&r.length>=meta.total)||d.length<10)break;}return {r,meta};};
const d=await all('desk'),c=await all('crm');
const dp=await api('GET','/iam/profiles?app_key=desk');
const dIds=new Map(d.r.map(x=>[x.userId,x.profileNames]));
const crmOnly=c.r.filter(x=>!dIds.has(x.userId));
const lightCrm=c.r.filter(x=>/light/i.test(String(dIds.get(x.userId)||'')));
return {desk:{n:d.r.length,meta:d.meta},crm:{n:c.r.length,meta:c.meta},deskProfiles:arr(dp.j&&dp.j.data).map(p=>p.name),
 crmUsersInDesk:c.r.filter(x=>dIds.has(x.userId)).length,crmOnlyCount:crmOnly.length,crmOnlySample:crmOnly.slice(0,5).map(x=>x.displayName),crmUsersWithLightAgentInDesk:lightCrm.length,
 deskProfileCounts:d.r.reduce((a,x)=>{String(x.profileNames||'').split(/,\s*/).forEach(n=>{a[n]=(a[n]||0)+1});return a},{})};
