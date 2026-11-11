module.exports=async()=>{const q=await api('GET','/desk/queues/agents');const d=arr((await api('GET','/desk/departments')).j.data);const nm=Object.fromEntries(d.map(x=>[x.id,x.name]));
 const a=(q.j.data.agents||[]).find(x=>x.user_id==='9d182dfa-05f3-4af7-9685-8615a2fbe537');return {name:a&&a.name,depts:a&&a.department_ids.map(i=>nm[i]||i)};};
