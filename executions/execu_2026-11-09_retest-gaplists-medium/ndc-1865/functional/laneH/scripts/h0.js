const out={};
const me=await api('GET','/iam/me');const m=me.j&&(me.j.data||me.j);out.me={id:m.id||m.userId,name:m.displayName};
const mods=arr((await api('GET','/modules')).j);out.modules=mods.map(x=>(x.api_name||x.apiName||x.name)+':'+x.id);
const deps=arr((await api('GET','/desk/departments')).j);out.depts=deps.filter(d=>/HR|Customer Support|Sales|Tech|Marketing/.test(d.name)).map(d=>d.name+':'+d.id);
for(const p of ['/desk/email-templates','/desk/email-templates/folders','/desk/notification-rules','/desk/feeds','/desk/feeds/posts','/desk/collaboration/connections','/desk/data/exports','/desk/data/imports','/desk/integrations/crm/status','/desk/integrations/crm/failures','/desk/integrations/crm/sync/failures','/desk/integrations/crm/queue','/desk/scheduled-replies','/audit/bulk-actions','/desk/bulk-actions','/audit/events?pageSize=3']){const r=await api('GET',p);out[p]=r.s+' '+r.t.slice(0,260);}
return out;
