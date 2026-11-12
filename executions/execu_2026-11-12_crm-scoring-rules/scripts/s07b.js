const L=await modId('leads');
const items=arr((await api('GET','/workflow/rules?module_id='+L)).j.data);
log('keys',Object.keys(items[0]).join(','));
const fu=items.find(x=>JSON.stringify(x.actions||'').includes('FieldUpdate'))||items.find(x=>(x.actions||[]).length);
log('actions',JSON.stringify(fu&&fu.actions).slice(0,900)); log('conditions',JSON.stringify(fu&&fu.conditions).slice(0,300)); log('other', JSON.stringify({isActive:fu&&fu.isActive,layoutId:fu&&fu.layoutId,mod:fu&&fu.moduleId,exec:fu&&fu.executionMode}));
