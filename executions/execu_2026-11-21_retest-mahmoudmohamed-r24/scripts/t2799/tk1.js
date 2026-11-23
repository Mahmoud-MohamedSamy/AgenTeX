const TK='88e8ea44-1658-4df3-9930-d0902b91073d',CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158',CONTACTS='43004ce2-577f-4eda-b00a-0750fe40c3d4';
const OUT='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-21_retest-mahmoudmohamed-r24/out/2799-made.json';
const G='mahmoud.mmohamedsamy+qaao@gmail.com';const M=JSON.parse(fs.readFileSync(OUT,'utf8'));const v=x=>({kind:'string',value:String(x)});const E=r=>r.s+(r.s>=300?' '+r.t.slice(0,300):'');
const val=x=>!x?undefined:x.kind==='array'?(x.items||[]).map(val):x.value;
const fld=async t=>Object.fromEntries(((await api('GET','/modules/'+TK+'/records/'+t)).j?.data?.data||[]).map(x=>[x.field,val(x.value)]));
const bst=async t=>(((await api('GET','/modules/'+TK+'/records/'+t+'/blueprint-state')).j?.data?.states||[])[0]||null);
const c=await api('POST','/modules/'+CONTACTS+'/records',{data:[{field:'last_name',value:v('QA RT24 BP customer')},{field:'email',value:v(G)}]});M.contact=c.j?.data?.id;M.contactRes=E(c);
if(!M.contact){const s=await api('GET','/modules/'+CONTACTS+'/records?search='+encodeURIComponent(G));M.contactSearch=s.t.slice(0,300);}
M.tickets={};const K={PRIV1:'PRIV',PUB1:'PUB',ALL1:'ALL',ALL2:'ALL',DEF1:'DEF'};
for(const [k,tag] of Object.entries(K)){const r=await api('POST','/modules/'+TK+'/records',{data:Object.entries({subject:'QA RT24 BP '+tag+' '+k+' reply test',status:'Open',department:CS,contact_id:M.contact,email:G,channel:'email'}).map(([f,x])=>({field:f,value:v(x)}))});M.tickets[k]={id:r.j?.data?.id,res:E(r)};await sleep(1200);}
await sleep(6000);
for(const k of Object.keys(K)){const t=M.tickets[k];const b=await bst(t.id);t.bp=b?.blueprintId||b?.blueprint_id;t.entered=b?.activeStates;
 t.hold=E(await api('POST','/desk/tickets/'+t.id+'/blueprint-transitions/hold',{run_id:crypto.randomUUID(),expected_state_id:'Open',fields:{}}));}
await sleep(5000);for(const k of Object.keys(K)){const t=M.tickets[k];const f=await fld(t.id);t.num=f.ticket_number;t.status=f.status;t.state=(await bst(t.id))?.activeStates;}
fs.writeFileSync(OUT,JSON.stringify(M,null,1));log(JSON.stringify(M.tickets).replace(/mahmoud\.mmohamedsamy/g,'G'),M.contactRes);
