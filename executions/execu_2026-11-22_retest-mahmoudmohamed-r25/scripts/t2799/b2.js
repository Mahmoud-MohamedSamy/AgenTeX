const TK='88e8ea44-1658-4df3-9930-d0902b91073d',CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158',CONTACTS='43004ce2-577f-4eda-b00a-0750fe40c3d4';
const RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-22_retest-mahmoudmohamed-r25';
const OUT=RUN+'/out/2799-made2.json';const LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+'Z 2799: '+m+'\n');
const G='mahmoud.mmohamedsamy@gmail.com',C2='qa.rt25.bp2@example.com';
const v=x=>({kind:'string',value:String(x)});const E=r=>r.s+(r.s>=300?' '+r.t.slice(0,300):'');
const val=x=>!x?undefined:x.kind==='array'?(x.items||[]).map(val):x.value;
const fld=async t=>Object.fromEntries(((await api('GET','/modules/'+TK+'/records/'+t)).j?.data?.data||[]).map(x=>[x.field,val(x.value)]));
const bst=async t=>(((await api('GET','/modules/'+TK+'/records/'+t+'/blueprint-state')).j?.data?.states||[])[0]||null);
const st=(id,x={})=>({id,name:id,position:{x:0,y:0},slaClock:'calendar',...x});
const tr=(id,a,b)=>({id,name:'QA '+id,fromStateId:a,toStateId:b,before:{},during:{},after:{actions:[]}});
const def=(tag,threads)=>({name:'QA RT25B BP '+tag,description:'QA r25b NDC-2799 reply filter - safe to delete',moduleKey:'desk_tickets',targetField:'status',departmentId:CS,
 entryCriteria:{op:'contains',field:'subject',value:'QA RT25B BP '+tag+' '},
 states:[st('Open'),st('On Hold',{onReplyTransitionId:'back',...(threads===undefined?{}:{onReplyThreads:threads})}),st('Escalated'),st('Closed',{isTerminal:true})],
 transitions:[tr('hold','Open','On Hold'),tr('back','On Hold','Escalated'),tr('close','Escalated','Closed')]});
const M={at:new Date().toISOString(),bp:{},t:{}};



for(const [tag,x] of [['PRIV','private'],['PUB','public']]){const r=await api('POST','/modules/'+TK+'/blueprints',{definition:def(tag,x),isActive:true});const id=r.j?.data?.id;M.bp[tag]={id,res:E(r)};if(id)LED('blueprint '+id+' QA RT25 BP '+tag);
 const g=await api('GET','/modules/'+TK+'/blueprints/'+id);const s=(g.j?.data?.definition?.states||[]).find(y=>y.id==='On Hold');M.bp[tag].saved={tr:s?.onReplyTransitionId,threads:s?.onReplyThreads};}
for(const [k,name,mail] of [['c1','QA RT25B BP customer',G]]){const c=await api('POST','/modules/'+CONTACTS+'/records',{data:[{field:'last_name',value:v(name)},{field:'email',value:v(mail)}]});M[k]=c.j?.data?.id;M[k+'Res']=E(c);if(M[k])LED('contact '+M[k]+' '+name);}
const K={CPRIV:['PRIV','c1',G],CPUB:['PUB','c1',G]};
for(const [k,[tag,c,mail]] of Object.entries(K)){const r=await api('POST','/modules/'+TK+'/records',{data:Object.entries({subject:'QA RT25B BP '+tag+' '+k+' reply test',status:'Open',department:CS,contact_id:M[c],email:mail,channel:'email'}).map(([f,x])=>({field:f,value:v(x)}))});M.t[k]={id:r.j?.data?.id,res:E(r),tag};if(M.t[k].id)LED('ticket '+M.t[k].id+' '+k);await sleep(1200);}
await sleep(6000);
for(const k of Object.keys(K)){const t=M.t[k];const b=await bst(t.id);t.bp=b?.blueprintName;t.entered=b?.activeStates;
 t.hold=E(await api('POST','/desk/tickets/'+t.id+'/blueprint-transitions/hold',{run_id:globalThis.crypto.randomUUID(),expected_state_id:'Open',fields:{}}));}
await sleep(5000);
for(const k of Object.keys(K)){const t=M.t[k];const f=await fld(t.id);t.num=f.ticket_number;t.status=f.status;t.state=(await bst(t.id))?.activeStates;}
fs.writeFileSync(OUT,JSON.stringify(M,null,1));
return JSON.parse(JSON.stringify(M).replace(/mahmoud\.mmohamedsamy/g,'G'));
