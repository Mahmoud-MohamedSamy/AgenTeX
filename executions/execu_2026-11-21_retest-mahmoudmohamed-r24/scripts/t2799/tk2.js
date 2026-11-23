const TK='88e8ea44-1658-4df3-9930-d0902b91073d',CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158',CONTACTS='43004ce2-577f-4eda-b00a-0750fe40c3d4';
const OUT='out/2799-made.json';const M=JSON.parse(fs.readFileSync(OUT,'utf8'));
const G='mahmoud.mmohamedsamy@gmail.com',C2='qa.rt24.bp2@example.com';const v=x=>({kind:'string',value:String(x)});const E=r=>r.s+(r.s>=300?' '+r.t.slice(0,300):'');
const val=x=>!x?undefined:x.kind==='array'?(x.items||[]).map(val):x.value;
const fld=async t=>Object.fromEntries(((await api('GET','/modules/'+TK+'/records/'+t)).j?.data?.data||[]).map(x=>[x.field,val(x.value)]));
const bst=async t=>(((await api('GET','/modules/'+TK+'/records/'+t+'/blueprint-state')).j?.data?.states||[])[0]||null);
const c=await api('POST','/modules/'+CONTACTS+'/records',{data:[{field:'last_name',value:v('QA RT24 BP customer2')},{field:'email',value:v(C2)}]});M.contact2=c.j?.data?.id;M.contact2Res=E(c);
M.t2={};const K={PRIV2:'PRIV',PUB2:'PUB',ALL3:'ALL',DEF2:'DEF'};
for(const [k,tag] of Object.entries(K)){const r=await api('POST','/modules/'+TK+'/records',{data:Object.entries({subject:'QA RT24 BP '+tag+' '+k+' private test',status:'Open',department:CS,contact_id:M.contact2,email:C2,channel:'email'}).map(([f,x])=>({field:f,value:v(x)}))});M.t2[k]={id:r.j?.data?.id,res:E(r)};await sleep(1200);}
await sleep(6000);
for(const k of Object.keys(K)){const t=M.t2[k];const b=await bst(t.id);t.bp=b?.blueprintName;t.entered=b?.activeStates;
 t.hold=E(await api('POST','/desk/tickets/'+t.id+'/blueprint-transitions/hold',{run_id:globalThis.crypto.randomUUID(),expected_state_id:'Open',fields:{}}));}
await sleep(5000);
for(const k of Object.keys(K)){const t=M.t2[k];const f=await fld(t.id);t.num=f.ticket_number;t.status=f.status;t.state=(await bst(t.id))?.activeStates;
 const r=await api('POST','/desk/tickets/'+t.id+'/replies',{mode:'forward',to:[G],subject:'Fwd: QA RT24 '+k+' private thread [#'+t.num+']',body_html:'<p>QA RT24 '+k+' (#'+t.num+'): private thread test. Please REPLY to this email from Gmail and keep the subject.</p>'});
 t.fwd={res:E(r),at:new Date().toISOString(),pub:r.j?.data?.is_public};await sleep(1500);}
fs.writeFileSync(OUT,JSON.stringify(M,null,1));
return {c:M.contact2Res,t:M.t2};
