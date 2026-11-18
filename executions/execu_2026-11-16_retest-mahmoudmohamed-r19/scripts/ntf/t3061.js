const R={};const TAG='QA BP RT19 NTF 3061';
const ST=(id,x={})=>({id,name:id,position:{x:0,y:0},slaClock:'calendar',...x});
const notif={kind:'sendNotification',title:'QA RT19 NTF 3061 moved to On Hold {{subject}}',body:'QA RT19 NTF 3061 blueprint notification body',userIds:[A2,O,A1],orgUnitId:null,notifyOwner:false,recipientMode:'users',notifyPerformer:false};
const def={name:TAG+' hold',description:'QA RT19 NTF retest - safe to delete',moduleKey:'desk_tickets',targetField:'status',departmentId:D,entryCriteria:{op:'contains',field:'subject',value:TAG+' '},
 states:[ST('Open'),ST('On Hold',{position:{x:400,y:0}}),ST('Closed',{isTerminal:true,position:{x:800,y:0}})],
 transitions:[{id:'hold',name:'QA Move to On Hold',fromStateId:'Open',toStateId:'On Hold',before:{allowOwner:true},during:{},after:{actions:[notif,{kind:'setField',field:'description',value:'QA RT19 NTF 3061 set by blueprint'}]}},{id:'close',name:'QA close',fromStateId:'On Hold',toStateId:'Closed',before:{allowOwner:true},during:{},after:{actions:[]}}]};
if(!I.bp3061){const b=await api('POST','/modules/'+TK+'/blueprints',{definition:def,isActive:true});R.bp=E(b);I.bp3061=b.j?.data?.id;saveI();if(I.bp3061)LED('blueprint '+I.bp3061+' "'+def.name+'" created active in QA RT19 NTF Dept');else return R;}
const r=await api('POST','/modules/'+TK+'/records',{data:fields({subject:TAG+' run 1',description:'QA RT19 NTF 3061',status:'Open',department:D,priority:'medium',owner:O,channel:'web'})});const id=r.j?.data?.id;if(!id){R.t=E(r);return R;}(I.tickets=I.tickets||[]).push(id);I.t3061=id;saveI();
let st=null;for(let i=0;i<15&&!st;i++){await sleep(2000);st=Ls((await api('GET','/modules/'+TK+'/records/'+id+'/blueprint-state')).j?.data?.states)[0]||null;}
R.n=(await rec(id)).ticket_number;LED('ticket created '+id+' #'+R.n+' "'+TAG+' run 1"');R.inBp=!!st;
R.runAt=new Date().toISOString();R.run=E(await api('POST','/desk/tickets/'+id+'/blueprint-transitions/hold',{run_id:crypto.randomUUID(),expected_state_id:'Open',fields:{}}));
await sleep(20000);const x=await rec(id);R.status=x.status;R.desc=x.description;R.feed=await feedS(id);
const nb=(await api('GET','/notifications?limit=30&apps=desk')).j?.data;R.ownerBell=(nb?.data||[]).filter(n=>/3061/.test(n.title||'')).map(n=>n.created_at.slice(11,19)+' '+n.app_key+' '+n.module+' '+n.event_type+' '+n.title);
const na=(await api('GET','/notifications?limit=30')).j?.data;R.ownerAll=(na?.data||[]).filter(n=>/3061/.test(n.title||'')).map(n=>n.created_at.slice(11,19)+' '+n.app_key+' '+n.module+' '+n.event_type);
I.t3061info=R;saveI();
return R;
