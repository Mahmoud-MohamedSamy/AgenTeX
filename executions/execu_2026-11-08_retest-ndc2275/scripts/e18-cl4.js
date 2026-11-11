// Recovery after cl3 crash: collect E18 evidence (state + history since 10:02 UTC), screenshots, then restore everything. Null-safe.
module.exports=async()=>{const R={};const T1='33dfd714-5b9e-4c51-86f4-f33dd1fe9504';const DB=IDS.DB;const MK='2a73bbc0-efb3-4250-bf9b-2fdc98236794';const RAW=OUT+'/../screenshots/raw/cl-e18-';const PW=ms=>pg.waitForTimeout(ms);
 const RULE='1f857625-cd2b-4cef-bde3-6daf32a28599',CTL='c27016bc-4079-40c7-97e0-6b7eb410630e',DUP='fe83f126-9176-40ce-9376-11145a3271f5',EM03='c8590aab-2f4d-46a5-81b8-bb096c8736fc';
 const ORIG_CLOSED='2026-10-12T12:43:13.2306828+00:00';const SINCE='2026-11-10T10:02';
 const enc=v=>v===null?{kind:'null'}:{kind:'string',value:v};const body=vals=>({data:Object.entries(vals).map(([f,v])=>({field:f,value:enc(v)}))});
 const safe=async(k,fn)=>{try{return await fn();}catch(e){R['err_'+k]=String(e.message).slice(0,200);return null;}};
 const rec=async id=>{const r=await api('GET','/modules/'+T+'/records/'+id);return r.j&&r.j.data?fl(r.j.data):{_status:r.s};};
 const st=async id=>{const o=await rec(id);const d=((await api('GET','/desk/tickets/'+id)).j||{}).data||{};const ow=o.owner?(o.owner.id||o.owner):null;return {no:o.ticket_number,owner:ow===IDS.A1?'Test User 1':ow===IDS.O?'ndc-staging-owner':ow?String(ow).slice(0,8):'Unassigned',status:d.status||o.status,dept:d.department_id===DB?'QA AS6 Dept B':d.department_id===MK?'Marketing':String(d.department_id||o.department||'').slice(0,8),in_backlog:d.in_backlog,closed_time:o.closed_time,_s:o._status};};
 const act=async id=>{const a=((await api('GET','/desk/tickets/'+id+'/activity')).j||{}).data;return (Array.isArray(a)?a:[]).filter(x=>x.occurred_at>SINCE).map(x=>x.occurred_at.slice(11,19)+' '+x.action+' '+JSON.stringify(x.summary||{}).slice(0,220));};
 const shot=async(id,name,hist)=>safe('shot_'+name,async()=>{await pg.setViewportSize({width:1600,height:1000});for(let k=0;k<3;k++){try{await pg.goto(H+'/views/all/tickets/'+id,{waitUntil:'commit',timeout:60000});}catch(e){continue;}const ok=await pg.waitForFunction(()=>/Ticket Owner/.test(document.body.innerText),null,{timeout:60000}).then(()=>true).catch(()=>false);if(ok)break;}await PW(4000);if(hist){const h=pg.getByText(/^HISTORY$/i).first();if(await h.count()){await h.click();await PW(5000);}}await pg.screenshot({path:RAW+name+'.png'});});
 const prefUrl='/desk/departments/'+DB+'/round-robin-preferences';
 R.at=new Date().toISOString().slice(11,19);
 R.stateNow={ctl:await safe('stctl',()=>st(CTL)),t1:await safe('stt1',()=>st(T1)),prefs:await safe('pref',async()=>(await api('GET',prefUrl)).j.data)};
 const rl=await safe('rules',async()=>(((await api('GET','/desk/assignment-rules?type=round_robin&department_id='+DB)).j||{}).data||{}).rules||[]);R.ruleStillThere=!!(rl||[]).find(x=>x.id===RULE);
 R.histCtl=await safe('hc',()=>act(CTL));R.histT1=await safe('ht',()=>act(T1));
 await shot(T1,'03-t1-now',false);await shot(T1,'03-t1-history',true);await shot(CTL,'03-control-now',false);await shot(CTL,'03-control-history',true);
 // restore
 const cl={};
 cl.move=await safe('move',async()=>(await api('POST','/desk/tickets/'+T1+'/move',{department_id:MK,team_id:null,owner_id:IDS.O})).s);
 cl.close=await safe('close',async()=>(await api('PATCH','/modules/'+T+'/records/'+T1,body({status:'Closed'}))).s);
 await W(5000);
 cl.closedTime=await safe('ct',async()=>(await api('PATCH','/modules/'+T+'/records/'+T1,body({closed_time:ORIG_CLOSED}))).s);
 if(R.ruleStillThere)cl.ruleDel=await safe('rd',async()=>(await api('DELETE','/desk/assignment-rules/'+RULE)).s);
 cl.del={};for(const id of [CTL,DUP]){cl.del[id.slice(0,8)]=await safe('d'+id.slice(0,4),async()=>(await api('DELETE','/modules/'+T+'/records/'+id)).s);}
 const P0={assign_to_offline_agents:false,department_threshold_enabled:false,department_threshold:40,agent_threshold_enabled:false,assign_backlogs:false,assign_on_closure:false,incoming_mode:'immediate'};
 cl.prefs=await safe('pr',async()=>{const cur=(await api('GET',prefUrl)).j.data;const r=await api('PUT',prefUrl,{...cur,...P0});const after=(await api('GET',prefUrl)).j.data;return r.s+' '+JSON.stringify(Object.fromEntries(Object.keys(P0).map(k=>[k,after[k]])));});
 await W(4000);cl.bin=await safe('bin',async()=>{let cur='',items=[];for(let i=0;i<15;i++){const r=await api('GET','/audit/recycle-bin/items?app_key=desk&limit=200'+(cur?'&cursor='+encodeURIComponent(cur):''));for(const x of arr(r.j.data))if([CTL,DUP].includes(x.record_id))items.push(x.id);cur=r.j.meta&&r.j.meta.next_cursor;if(!cur||items.length>=2)break;}const p=items.length?(await api('POST','/audit/recycle-bin/delete',{ids:items})).s:'none';return items.length+' '+p;});
 await W(60000);
 R.t1After=await safe('t1a',()=>st(T1));R.ctlAfter=await safe('ca',async()=>(await api('GET','/modules/'+T+'/records/'+CTL)).s);R.dupAfter=await safe('da',async()=>(await api('GET','/modules/'+T+'/records/'+DUP)).s);
 R.ruleAfter=await safe('ra',async()=>!!((((await api('GET','/desk/assignment-rules?type=round_robin&department_id='+DB)).j||{}).data||{}).rules||[]).find(x=>x.id===RULE));
 R.cleanup=cl;LED('CL recovery cleanup '+JSON.stringify({cl,t1:R.t1After,ctl:R.ctlAfter,dup:R.dupAfter,rule:R.ruleAfter}));
 R.em03replies=await safe('em',async()=>(((await api('GET','/desk/tickets/'+EM03+'/replies')).j||{}).data||[]).map(x=>x.direction+':'+(x.status||'')+':'+String(x.created_at||'').slice(11,19)));await shot(EM03,'em03-sent',false);
 return R;};
