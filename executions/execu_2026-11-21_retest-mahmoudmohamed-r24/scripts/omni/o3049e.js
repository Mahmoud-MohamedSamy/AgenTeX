const o={};const p=await api('POST','/iam/profiles',{name:'QA RT22 3049 plain',appKey:'salesiq',app_key:'salesiq',parentProfileId:'22222222-2222-2222-2222-222222222203',rank:20});const pid=p.j?.data?.profile_id;o.create=p.s;
fs.appendFileSync('../ledger.md','- OMNI: 3049 profile plain '+pid+'\n');const t0=Date.now();const d=await api('DELETE','/iam/profiles/'+pid);o.deletePlain=d.s+' '+(Date.now()-t0)+'ms '+String(d.t).slice(0,120);
o.listed=arr((await api('GET','/iam/profiles?take=500')).j?.data).some(x=>(x.profileId||x.id)===pid);
const t1=Date.now();const c=await api('GET','/iam/users?pageSize=5');o.usersGet=c.s+' '+(Date.now()-t1)+'ms';return o;
