const rows=arr((await api('GET','/iam/users')).j);const ids=new Set(rows.map(r=>String(r.userId).toLowerCase()));
const ev=arr((await api('GET','/audit/events?limit=200')).j);
const k=Object.keys(ev[0]||{});
const act=[...new Set(ev.map(e=>String(e.actor_id||e.actorId||e.user_id||e.userId||'').toLowerCase()).filter(Boolean))].filter(a=>!ids.has(a));
const out=[];for(const a of act){const r=await api('GET','/iam/users/'+a);const e=ev.find(x=>String(x.actor_id||x.actorId||x.user_id||x.userId).toLowerCase()===a);out.push({id:a.slice(0,8)+'…',getUser:r.s,status:r.j&&r.j.data&&r.j.data.status,actorName:e&&(e.actor_name||e.actorName||e.actorDisplayName),actorType:e&&(e.actor_type||e.actorType)});}
// also: last user alphabetically / ordering
const em=rows.map(r=>(r.displayName||'').toLowerCase()).filter(Boolean);
return {eventKeys:k.slice(0,15),out,sortedByName:JSON.stringify(em)===JSON.stringify([...em].sort())};
