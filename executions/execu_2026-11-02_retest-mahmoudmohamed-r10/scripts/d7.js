const r=await api('o','POST',`/iam/users/${T.U3}/profiles`,{profile_id:T.P_USER,scope_id:T.OU_AGENTX,replace:true}); await sleep(3000);
let u=arr((await api('o','GET','/iam/users?limit=200')).j?.data).find(x=>x.userId===T.U3);
if(!/Desk Agent/.test(u.profileNames)){ await api('o','POST',`/iam/users/${T.U3}/profiles`,{profile_id:'44444444-4444-4444-4444-444444444402',scope_id:T.OU_AGENTX,replace:false}); await sleep(2000); u=arr((await api('o','GET','/iam/users?limit=200')).j?.data).find(x=>x.userId===T.U3); }
ledger(`user U3: CRM profile back to User @ agent x (${r.s}); still Desk Agent + member of QA WF Dept R until Desk retests finish`);
return [r.s, u.profileNames];
