const me=await api('GET','/iam/me');const d=me.j&&me.j.data||{};
const keys=Object.keys(d).slice(0,15);const myId=String(d.userId||d.user_id||d.id||(d.user&&d.user.id)||'');
const users=arr((await api('GET','/iam/users')).j);const nm=id=>{const u=users.find(x=>String(x.userId)===String(id));return u?u.displayName:'?'};
const deps=arr((await api('GET','/desk/departments')).j);
const b=deps.find(x=>x.name==='QA AS6 Dept B');
return {keys,myIdLen:myId.length,myDepts:deps.filter(x=>(x.agent_user_ids||[]).map(String).includes(myId)).map(x=>x.name),deptB:(b.agent_user_ids||[]).map(nm),deptKeys:Object.keys(b).slice(0,20)};
