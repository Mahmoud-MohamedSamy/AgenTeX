const L=await modId('leads');
const l=await api('GET','/workflow/rules?module_id='+L); log('list',l.s); const items=arr(l.j&&l.j.data);
log('count',items.length); const one=items.find(x=>x.trigger&&x.trigger.kind)||items[0]; log('sample', JSON.stringify(one).slice(0,2500));
