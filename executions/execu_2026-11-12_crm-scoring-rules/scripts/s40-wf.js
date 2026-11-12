const L=await modId('leads'); const l=await api('GET','/web-forms?app=crm'); const items=arr(l.j&&l.j.data);
return items.filter(f=>f.module_id===L||f.moduleId===L).slice(0,6).map(f=>({name:f.name,status:f.status||f.is_active,kind:f.kind,embed:!!f.embed_key,id:f.id}));
