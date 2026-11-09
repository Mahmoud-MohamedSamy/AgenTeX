const rows=arr((await api('GET','/iam/users')).j);const ids=new Set(rows.map(r=>String(r.id||r.user_id||r.userId).toLowerCase()));
const d=await api('GET','/desk/departments');const deps=arr(d.j);const ag=new Set();for(const x of deps)for(const a of (x.agent_user_ids||x.agentUserIds||[]))ag.add(String(a).toLowerCase());
const miss=[...ag].filter(a=>!ids.has(a));
// audit actors
const ev=await api('GET','/audit/events?limit=200');const act=new Set(arr(ev.j).map(e=>String(e.actor_id||e.actorId||e.user_id||e.userId||'').toLowerCase()).filter(Boolean));const missA=[...act].filter(a=>!ids.has(a));
return {users:rows.length,sampleKeys:Object.keys(rows[0]||{}).slice(0,12),depts:deps.length,deptAgents:ag.size,deptAgentsNotInList:miss.length,auditActors:act.size,auditActorsNotInList:missA.length,missSample:miss.slice(0,3).map(x=>x.slice(0,8)+'…')};
