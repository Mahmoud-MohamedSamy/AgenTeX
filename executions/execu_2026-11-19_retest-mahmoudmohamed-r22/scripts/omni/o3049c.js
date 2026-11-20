const o={};const LED=m=>fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+'Z OMNI: '+m+'\n');
const c=await api('POST','/iam/users/invitations/b74dba6f-0978-4936-8fb1-7c6ba0f44e55/cancel',{});o.cancel=c.s+' '+String(c.t).slice(0,150);LED('3049 invitation cancel → '+c.s);
let d=await api('DELETE','/iam/profiles/f99f6c7a-04d9-481e-aefd-162eb2d5690f');o.deleteAfterCancel=d.s+' '+String(d.t).slice(0,200);if(d.s<300)LED('3049 profile cancel deleted');
const u=await api('DELETE','/iam/users/f922e168-a4f4-4fab-9e9a-840702b4dfce');o.deleteInvitedUser=u.s+' '+String(u.t).slice(0,150);LED('3049 invited user deleted → '+u.s);
d=await api('DELETE','/iam/profiles/b99cf1c7-3e8d-460c-b842-5fc50f1e783d');o.deleteAfterUserDelete=d.s+' '+String(d.t).slice(0,200);if(d.s<300)LED('3049 profile deluser deleted');
const ps=arr((await api('GET','/iam/profiles?take=500')).j?.data);o.leftQA=ps.filter(x=>/QA RT22 3049/.test(x.name)).map(x=>x.name);
const us=arr((await api('GET','/iam/users?include=invited')).j?.data);o.leftUsers=us.filter(x=>/3049/.test((x.displayName||'')+(x.email||''))).map(x=>x.displayName+' '+x.status);
return o;
