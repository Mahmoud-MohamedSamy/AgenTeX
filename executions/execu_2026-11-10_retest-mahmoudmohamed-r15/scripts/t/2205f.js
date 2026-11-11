const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-10_retest-mahmoudmohamed-r15';
const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+m+'\n');
const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const E=r=>r.j&&r.j.error?r.j.error.code+': '+r.j.error.message+' '+JSON.stringify(r.j.error.details||'').slice(0,300):'';
const enc=v=>({kind:'string',value:String(v)}); const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
const fl=r=>{const o={id:r.id};for(const x of (r.data||[])){const v=x.value||{};o[x.field]=v.kind==='array'?(v.items||[]).map(i=>i.value):v.value!==undefined?v.value:(v.kind==='null'?null:v);}return o;};
const mkT = async (subject, extra) => { const r = await api('POST','/modules/'+T+'/records', body({subject, email:'qa.rt15@example.com', priority:'High', status:'Open', ...extra})); const d=r.j&&r.j.data; const id=d&&(d.id||(d.record&&d.record.id)); if(id) LED('ticket "'+subject+'" '+id); return {s:r.s,id,e:E(r)}; };
const getT = async id => { const r = await api('GET','/modules/'+T+'/records/'+id); if(!r.j||!r.j.data) return {err:r.s+' '+E(r)}; const o = fl(r.j.data); return {num:o.ticket_number, dept:o.department, tags:o.tags, subject:o.subject, prio:o.priority}; };
const tagNames = async id => { const r = await api('GET','/desk/tickets/'+id+'/tags'); return r.s+' '+JSON.stringify(arr(r.j&&r.j.data).map(t=>t.name||t)).slice(0,200); };
const out={};
out.t1 = await mkT('QA RT15 2205 no dept', {});
out.t2 = await mkT('QA RT15 2205 dept AO', {department:'93949fbd-f9df-4e2e-ae45-00b8dc38385b'});
await sleep(20000);
for (const k of ['t1','t2']) { out[k].after = await getT(out[k].id); out[k].tagApi = await tagNames(out[k].id); }
fs.writeFileSync(RUN+'/out/2205-tickets.json', JSON.stringify(out,null,1));
return out;
