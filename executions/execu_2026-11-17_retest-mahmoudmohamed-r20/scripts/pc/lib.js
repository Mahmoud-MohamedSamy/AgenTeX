// AS lane (round 19) helpers, eval'd inside apiw.js scripts. Copied/adapted from execu_2026-11-08_desk-automation-order/scripts/lib-as.js.
// Prefix QA RT20 AS. Rules match only subjects starting with "QA RT20 AS" + a unique key.
var RUN='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_retest-mahmoudmohamed-r20';
var OUT=RUN+'/scripts/pc/out/';
var DA='b3cd7c28-7879-42b1-b7a9-06bc9bf64aa6',DB='ce1d8a43-07df-4b37-891c-cc8b2eceec6f',T='88e8ea44-1658-4df3-9930-d0902b91073d',TEAM='434140a3-2145-428c-9e57-e6bc5cf2f8d0';
var A1='876ce871-2b02-4854-89a7-68050391c62b',A2='d23fb4e0-248d-41f6-af60-d28885a7007e',A3='5491656d-4d92-4ba2-bd2b-6ee98ba1e2b4',O='97be04b6-0a08-4883-aa51-e1650b11cab7';
var NM={[A1]:'A1',[A2]:'A2',[A3]:'A3',[O]:'O',[TEAM]:'TeamA',[DA]:'AS6-A',[DB]:'AS6-B'};var nm=v=>v?(NM[v]||String(v).slice(0,8)):'none';
var PFX='QA RT20 PC';
var MADE=OUT+'made.json';var made=fs.existsSync(MADE)?JSON.parse(fs.readFileSync(MADE,'utf8')):{rules:[],tickets:[],other:[]};var saveMade=()=>{let d={rules:[],tickets:[],other:[]};try{d=JSON.parse(fs.readFileSync(MADE,'utf8'));}catch(e){}for(const k of ['rules','tickets','other'])made[k]=[...new Set([...(d[k]||[]),...(made[k]||[])].filter(x=>typeof x==='string'))];fs.writeFileSync(MADE,JSON.stringify(made));};
var LED=m=>fs.appendFileSync(RUN+'/ledger.md','- '+new Date().toISOString().slice(0,19)+'Z PC lane (NDC-3076): '+m+'\n');
var U=Math.random().toString(36).slice(2,6);
var sv=v=>v===null?{kind:'null'}:typeof v==='number'?{kind:'number',value:v}:typeof v==='boolean'?{kind:'boolean',value:v}:Array.isArray(v)?{kind:'array',items:v.map(sv)}:{kind:'string',value:String(v)};
var fields=o=>Object.entries(o).map(([k,v])=>({field:k,value:sv(v)}));
var tk=async(key,extra={},dept=DA)=>{const r=await api('POST','/modules/'+T+'/records',{data:fields({subject:PFX+' '+key,description:PFX+' '+key,department:dept,status:'Open',priority:'high',owner:null,...extra})});const id=r.j?.data?.id;if(id){made.tickets.push(id);saveMade();LED('ticket created '+id+' "'+PFX+' '+key+'"');}else return {err:r.s+' '+r.t.slice(0,300)};return id;};
var rec=async id=>{const d=(await api('GET','/modules/'+T+'/records/'+id)).j?.data?.data||[];const o={};for(const x of d){const v=x.value||{};o[x.field]=v.kind==='array'?(v.items||[]).map(i=>i.value):v.value;}return o;};
var recRaw=async id=>(await api('GET','/modules/'+T+'/records/'+id)).j?.data;
var st=async id=>{const o=await rec(id);return 'owner='+nm(o.owner)+' team='+nm(o.team)+' dept='+nm(o.department);};
var own=async id=>nm((await rec(id)).owner);
var patch=(id,o)=>api('PATCH','/modules/'+T+'/records/'+id,{data:fields(o)});
var feed=async id=>{const j=(await api('GET','/desk/tickets/'+id+'/activity')).j;return Array.isArray(j?.data)?j.data:(j?.data?.items||[]);};
var autos=async id=>(await feed(id)).filter(e=>/auto_assign|assign/.test(e.action||''));
var rule=async(type,name,targets,opt={})=>{const b={type,name:PFX+' '+name+' '+U,description:opt.description??'QA RT20 PC lane',is_active:opt.active??true,execute_on:opt.on||['create'],targets};if(type==='round_robin')b.department_id=opt.dept||DA;const r=await api('POST','/desk/assignment-rules',b);if(r.j?.data?.id){made.rules.push(r.j.data.id);saveMade();LED('rule created '+r.j.data.id+' '+type+' "'+b.name+'" active='+b.is_active);}return r;};
// criteria: subject starts with prefix AND subject contains unique key
var crit=(key,extra=[],pattern)=>{const c=[{field_key:'subject',operator:'starts_with',value:PFX},{field_key:'subject',operator:'contains',value:key},...extra];return {conditions:c,pattern:pattern||c.map((_,i)=>i+1).join(' and ')};};
var rrT=(key,method,users=[A1,A2,A3],extra=[],pattern)=>({criteria:crit(key,extra,pattern),method,pool:{kind:'agents',user_ids:users,team_id:null,excluded_user_ids:[]}});
var daT=(key,assign,o={})=>({criteria:o.criteria||crit(key),coming_to_department_id:o.coming===undefined?DA:o.coming,move_to_department_id:o.move||null,assign});
var ag=id=>({kind:'agent',user_id:id,team_id:null});
var notif=async()=>(await api('GET','/desk/assignment/notification-settings')).j?.data;
var prefs=async(d=DA)=>(await api('GET','/desk/departments/'+d+'/round-robin-preferences')).j?.data;
var setPrefs=(o,d=DA)=>api('PUT','/desk/departments/'+d+'/round-robin-preferences',o);
var wl=async (id,d=DA)=>{const x=(await api('GET','/desk/agents/'+id+'/workload')).j?.data?.departments||[];return {dept:x.find(y=>y.department_id===d)?.open_tickets,all:x.reduce((s,y)=>s+(y.open_tickets||0),0),raw:x.find(y=>y.department_id===d)};};
var presence=async()=>{const a=(await api('GET','/desk/queues/agents')).j?.data;const L=Array.isArray(a)?a:(a?.agents||[]);return L.filter(x=>[A1,A2,A3].includes(x.user_id)).map(x=>nm(x.user_id)+':'+(x.presence?.online?'on':'off')+(x.presence?.channels?.email?'':'/noemail')).join(' ');};
var E=r=>r.s+(r.s>=300?' '+(r.j?.error?.code||'')+' '+(r.j?.error?.message||r.t).slice(0,220):'');
var listRules=async(t,d)=>(await api('GET','/desk/assignment-rules?type='+t+(d?'&department_id='+d:''))).j?.data?.rules||[];
var getRule=async(id)=>{for(const [t,d] of [['round_robin',DA],['round_robin',DB],['round_robin','4853562a-0b4d-45cb-ba34-9f2118fcd32c'],['direct',null]]){const x=(await listRules(t,d)).find(r=>r.id===id);if(x)return x;}return null;};
var setA=async(id,v)=>{const g=await getRule(id);const p=await api('PUT','/desk/assignment-rules/'+id+'/active',{is_active:v,version:g?.version});LED('rule '+id+' active='+v+' -> '+p.s);return p.s;};
var _api=api;api=async(m,p,b)=>{let e;for(let i=0;i<4;i++){try{return await _api(m,p,b);}catch(x){e=x;await sleep(10000);}}throw e;};
var waitOwn=async(id,s=20)=>{let o='none';for(let i=0;i<s/2;i++){o=await own(id);if(o!=='none')return o;await sleep(2000);}return o;};
var save=(name,o)=>fs.writeFileSync(OUT+name,JSON.stringify(o,null,1));
// r20: Desk ingest lags behind the record (minutes under load). Wait until Desk has the ticket, then wait for the owner.
var waitDesk=async(id,s=480)=>{const t0=Date.now();for(let i=0;i<s/4;i++){const d=(await api('GET','/desk/tickets/'+id)).j?.data;if(d?.ticket_number)return {n:d.ticket_number,lag:Math.round((Date.now()-t0)/1000)};await sleep(4000);}return {n:'?',lag:-1};};
var waitRR=async(id,s=60)=>{const d=await waitDesk(id);let o='none';for(let i=0;i<s/3;i++){o=await own(id);if(o!=='none')break;const f=await feed(id);if(f.some(e=>/backlog|no_eligible|skipped|auto_assign/.test(e.action)))break;await sleep(3000);}return {o,n:d.n,lag:d.lag};};
