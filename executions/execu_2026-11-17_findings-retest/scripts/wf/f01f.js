const o={};const DA='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6';
const j=(await api('GET','/desk/tickets/ec361af9-7290-48a6-8792-eb3472070509/activity')).j;const f=Array.isArray(j?.data)?j.data:(j?.data?.items||[]);o.feed=f.map(e=>e.action+' '+(e.occurred_at||e.created_at||'')+' '+JSON.stringify(e.details||e.payload||e.metadata||'').slice(0,200));
o.prefs=(await api('GET','/desk/departments/'+DA+'/round-robin-preferences')).j?.data;
const a=(await api('GET','/desk/queues/agents')).j?.data;const L=Array.isArray(a)?a:(a?.agents||[]);o.pres=L.filter(x=>['876ce871','d23fb4e0','5491656d'].some(p=>x.user_id.startsWith(p))).map(x=>x.user_id.slice(0,8)+':'+(x.presence?.online?'on':'off'));
return o;
