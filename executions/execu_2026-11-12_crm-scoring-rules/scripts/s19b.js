const r=await api('GET','/audit/events?entity_type=scoring_rule'); log('keys',Object.keys(r.j||{}), 'data keys', r.j&&r.j.data&&Object.keys(r.j.data).slice(0,10), 'meta', JSON.stringify(r.j&&r.j.meta).slice(0,200));
const items=Array.isArray(r.j.data)?r.j.data:(r.j.data.items||r.j.data.events||[]); const c={}; items.forEach(e=>{c[e.action]=(c[e.action]||0)+1;}); log('count',items.length, JSON.stringify(c));
const u=items.find(e=>/updat/.test(e.action)); log('upd', String(JSON.stringify(u&&u.changes)).slice(0,300));
