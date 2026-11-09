const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const wr=await api('GET','/workflow/rules?take=200'); const w=arr(wr.j&&wr.j.data).filter(r=>(r.moduleId||r.module_id)===T);
const o={rules:w.map(r=>[r.name.slice(0,40),JSON.stringify(r.departmentIds),r.layoutId])};
for (const p of ['/desk/blueprints?module_id='+T,'/desk/blueprints?limit=50','/blueprints?moduleId='+T,'/desk/macros','/desk/snippets','/desk/ticket-templates','/desk/ticket-number-formats','/desk/settings/ticket-number']) { const r=await api('GET',p); o[p]=r.s+' '+r.t.slice(0,250); }
return done(o);
