const TK='88e8ea44-1658-4df3-9930-d0902b91073d',CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';
const OUT='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-21_retest-mahmoudmohamed-r24/out/2799-made.json';
const st=(id,x={})=>({id,name:id,position:{x:0,y:0},slaClock:'calendar',...x});
const tr=(id,a,b)=>({id,name:'QA '+id,fromStateId:a,toStateId:b,before:{},during:{},after:{actions:[]}});
const def=(tag,threads,extra={})=>({name:'QA RT24 BP '+tag,description:'QA r24 NDC-2799 reply filter - safe to delete',moduleKey:'desk_tickets',targetField:'status',departmentId:CS,
 entryCriteria:{op:'contains',field:'subject',value:'QA RT24 BP '+tag+' '},
 states:[st('Open'),st('On Hold',{onReplyTransitionId:'back',...(threads===undefined?{}:{onReplyThreads:threads}),...extra}),st('Escalated'),st('Closed',{isTerminal:true})],
 transitions:[tr('hold','Open','On Hold'),tr('back','On Hold','Escalated'),tr('close','Escalated','Closed')]});
const E=r=>r.s+(r.s>=300?' '+r.t.slice(0,400):'');
const M={at:new Date().toISOString(),bp:{}};
// negatives
M.negUnknown=E(await api('POST','/modules/'+TK+'/blueprints',{definition:def('NEG1','xyz'),isActive:false}));
const d2=def('NEG2','private');d2.states[1].onReplyTransitionId=undefined;delete d2.states[1].onReplyTransitionId;
M.negNoTransition=E(await api('POST','/modules/'+TK+'/blueprints',{definition:d2,isActive:false}));
for(const [tag,v] of [['PRIV','private'],['PUB','public'],['ALL','all'],['DEF',undefined]]){const r=await api('POST','/modules/'+TK+'/blueprints',{definition:def(tag,v),isActive:true});M.bp[tag]={id:r.j?.data?.id,res:E(r)};}
// read back
for(const k of Object.keys(M.bp)){const id=M.bp[k].id;if(!id)continue;const g=await api('GET','/modules/'+TK+'/blueprints/'+id);const s=(g.j?.data?.definition?.states||[]).find(x=>x.id==='On Hold');M.bp[k].saved={onReplyTransitionId:s?.onReplyTransitionId,onReplyThreads:s?.onReplyThreads};}
fs.writeFileSync(OUT,JSON.stringify(M,null,1));log(M);
