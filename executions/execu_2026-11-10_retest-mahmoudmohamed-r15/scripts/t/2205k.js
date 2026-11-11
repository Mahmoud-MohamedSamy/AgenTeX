const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const id='76c9b940-4734-4305-8277-f98956666ae7';
await sleep(10000);
const fl=r=>{const o={id:r.id};for(const x of (r.data||[])){const v=x.value||{};o[x.field]=v.kind==='array'?(v.items||[]).map(i=>i.value):v.value!==undefined?v.value:(v.kind==='null'?null:v);}return o;};
const o = fl((await api('GET','/modules/'+T+'/records/'+id)).j.data);
const tl = await api('GET','/desk/tickets/'+id+'/activity');
return { num:o.ticket_number, prio:o.priority, status:o.status, dept:o.department, tags:o.tags, activity: arr(tl.j&&tl.j.data).map(a=>a.type+(a.payload&&a.payload.rule_name?' '+a.payload.rule_name:'')+(a.details&&a.details.rule_name?' '+a.details.rule_name:'')).slice(0,15), raw: JSON.stringify(arr(tl.j&&tl.j.data).filter(a=>/workflow/.test(a.type)).map(a=>a)).slice(0,600) };
