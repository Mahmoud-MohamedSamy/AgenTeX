const o={};const b=await (await ctx.request.get(H+'/')).text();const main=b.match(/src="([^"]+index[^"]+\.js)"/)[1];const t=await (await ctx.request.get(H+main)).text();
o.r=[...t.matchAll(/auditLog:.{0,80}/g)].map(m=>m[0]).slice(0,3);
const a=await (await ctx.request.get(H+'/assets/AuditLogPage-C1WSw9C8.js')).text();
o.params=[...new Set([...a.matchAll(/(actor_user_id|actor_type|occurred_from|from|to|date_from|search|q|entity_type|target_type)[:=]/g)].map(m=>m[1]))];
o.sys=[...a.matchAll(/.{0,80}(actor_type|System|system).{0,80}/g)].map(m=>m[0]).slice(0,5);
return o;
