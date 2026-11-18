const ms=arr((await api('GET','/modules')).j.data); const o={};
for(const k of ['desk_tasks','desk_calls','desk_events']){ const m=ms.find(x=>x.moduleKey===k); const F=arr((await api('GET','/modules/'+m.id+'/fields')).j.data); o[k]={id:m.id,req:F.filter(f=>f.required||f.isMandatory).map(f=>f.fieldName+':'+f.datatypeKey), some:F.map(f=>f.fieldName+':'+f.datatypeKey).filter(s=>/ticket|depart|due|start|end|subject|owner|status|call_type|related|what|who|type/.test(s)).slice(0,30)}; }
return o;
