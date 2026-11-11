const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+m+'\n');
const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const enc=v=>({kind:'string',value:String(v)}); const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
const fl=r=>{const o={id:r.id};for(const x of (r.data||[])){const v=x.value||{};o[x.field]=v.kind==='array'?(v.items||[]).map(i=>i.value):v.value!==undefined?v.value:(v.kind==='null'?null:v);}return o;};
const out={}; const ids=[];
for (let i=1;i<=3;i++){ const r = await api('POST','/modules/'+T+'/records', body({subject:'QA RT15 2204 role '+i, email:'qa.rt15@example.com', status:'Open'})); const id=r.j&&r.j.data&&r.j.data.id; if(id){ids.push(id); LED('ticket "QA RT15 2204 role '+i+'" '+id);} }
await sleep(20000);
const users = {}; const ul = await api('GET','/iam/users?per_page=500'); arr(ul.j&&ul.j.data).forEach(u=>users[u.id||u.user_id]=u.email||u.display_name);
out.owners = [];
for (const id of ids) { const o = fl((await api('GET','/modules/'+T+'/records/'+id)).j.data); const act = await api('GET','/desk/tickets/'+id+'/activity'); out.owners.push({num:o.ticket_number, owner:o.owner, ownerName: users[o.owner]||'?', act: JSON.stringify(arr(act.j&&act.j.data).filter(a=>/workflow|owner|assign/.test(JSON.stringify(a))).slice(0,3)).slice(0,400)}); }
const me = await api('GET','/iam/users/'+(out.owners[0]&&out.owners[0].owner)); out.ownerDetail = me.s+' '+JSON.stringify(me.j&&me.j.data).slice(0,700);
return out;
