const TK='88e8ea44-1658-4df3-9930-d0902b91073d',DB='4853562a-0b4d-45cb-ba34-9f2118fcd32c',TU1='876ce871-2b02-4854-89a7-68050391c62b';
const OUT='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-21_retest-mahmoudmohamed-r24/out/3137-'+(process.env.CASE)+'.json';
const sv=v=>v===null?{kind:'null'}:{kind:'string',value:String(v)};const fields=o=>Object.entries(o).map(([k,v])=>({field:k,value:sv(v)}));
const pres=async()=>{const p=(await api('POST','/desk/agents/presence/query',{user_ids:[TU1]})).j?.data?.agents?.[0]?.presence;return {online:p?.online,last:p?.last_activity_at}};
const wl=async()=>(((await api('GET','/desk/agents/'+TU1+'/workload')).j?.data?.departments||[]).find(d=>d.department_id===DB)||{}).open_tickets;
const st=async id=>{const d=(await api('GET','/modules/'+TK+'/records/'+id)).j?.data?.data||[];const t=(await api('GET','/desk/tickets/'+id)).j?.data||{};const ow=(d.find(f=>f.field==='owner')||{}).value?.value||null;return {owner:ow===TU1?'TU1':ow,in_backlog:t.in_backlog,status:t.status,number:t.ticket_number||t.number}};
const mk=async s=>(await api('POST','/modules/'+TK+'/records',{data:fields({subject:s,description:'QA RT24 3137 retest',department:DB,status:'Open',priority:'medium',owner:null})})).j?.data?.id;
const C=process.env.CASE; const o={case:C,start:new Date().toISOString()};
let prev={}; try{prev=JSON.parse(fs.readFileSync(OUT.replace(/3137-.*/,'3137-base.json'),'utf8'))}catch(e){}
if(!prev.prefsBefore){prev.prefsBefore=(await api('GET','/desk/departments/'+DB+'/round-robin-preferences')).j?.data;fs.writeFileSync(OUT.replace(/3137-.*/,'3137-base.json'),JSON.stringify(prev,null,1));}
o.prefsBefore=prev.prefsBefore; o.presence=await pres(); o.tu1Open0=await wl();
const P=off=>api('PUT','/desk/departments/'+DB+'/round-robin-preferences',{...prev.prefsBefore,assign_to_offline_agents:off,agent_threshold_enabled:true,agent_thresholds:[{user_id:TU1,threshold:o.tu1Open0+1}],assign_on_closure:true,assign_backlogs:false});
o.prefsSet=(await P(true)).s;
let rule=prev.rule; if(!rule){const rr=await api('POST','/desk/assignment-rules',{type:'round_robin',department_id:DB,name:'QA RT24 3137 closure',description:'QA',is_active:true,execute_on:['create'],targets:[{criteria:{conditions:[{field_key:'subject',operator:'starts_with',value:'QA RT24 3137'}],pattern:'1'},method:'sequential',pool:{kind:'agents',user_ids:[TU1],team_id:null,excluded_user_ids:[]}}]});rule=rr.j?.data?.id;o.ruleRes=rr.s;prev.rule=rule;fs.writeFileSync(OUT.replace(/3137-.*/,'3137-base.json'),JSON.stringify(prev,null,1));}
o.rule=rule;
o.own=await mk('QA RT24 3137 '+C+' own'); await sleep(15000);
if(C==='B'){o.prefsOffOff=(await P(false)).s; o.prefsNow=(await api('GET','/desk/departments/'+DB+'/round-robin-preferences')).j?.data;}
o.back=await mk('QA RT24 3137 '+C+' backlog'); await sleep(15000);
o.setup={own:await st(o.own),back:await st(o.back),tu1Open:await wl(),presence:await pres()};
const p=await api('PATCH','/modules/'+TK+'/records/'+o.own,{data:[{field:'status',value:{kind:'string',value:'Closed'}}]}); const t0=Date.now(); o.close={s:p.s,at:new Date().toISOString()};
o.poll=[]; for(let i=0;i<12;i++){await sleep(10000);const s=await st(o.back);o.poll.push({sec:Math.round((Date.now()-t0)/1000),...s});if(s.owner)break;}
o.after={own:await st(o.own),tu1Open:await wl(),presence:await pres()};
const h=(await api('GET','/desk/tickets/'+o.back+'/history')).j?.data||[];o.history=(Array.isArray(h)?h:arr(h)).slice(0,8).map(e=>({at:e.created_at||e.at,action:e.action,actor:e.actor?.kind||e.actor?.name,sum:JSON.stringify(e.summary||e.changes||'').slice(0,160)}));
fs.writeFileSync(OUT,JSON.stringify(o,null,1)); log(o);
