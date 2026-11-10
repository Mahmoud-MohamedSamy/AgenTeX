const out={};
if(!ids.mgrSamy){const r=await api('PATCH',`/iam/users/${SAMY}/reporting-manager`,{reporting_manager_id:ids.userC});out.mgrSamy=r.s+' '+r.t.slice(0,200);if(r.s<300){ids.mgrSamy=true;save();log(`SETTING reporting manager of Mahmoud Samy → QA SS C (ORIGINAL: none) — restore to none`);}}
const u=arr((await api('GET','/iam/users?search=QA%20SS')).j.data).concat(arr((await api('GET','/iam/users?search=Mahmoud%20Samy')).j.data));out.mgrs=u.map(x=>x.displayName+' mgr='+(x.reportingManagerId||'none').slice(0,8));
return out;
