const out={}; const G='QA RT r10 2728';
const sa=await api('o','POST','/workflow/actions',{moduleId:T.LEADS,appKey:'crm',type:'ScheduleCall',name:G+' saved call',description:null,isActive:true,action:{type:'ScheduleCall',order:0,delaySeconds:0,activitySubject:G+' call from saved action'}});
out.saved=sa.s+' '+(sa.j?.data?.id||sa.t.slice(0,400)); const sid=sa.j?.data?.id; if(!sid) return out; ledger(`saved action ${sid} "${G} saved call"`);
const w=await X.made('o','/workflow/rules',X.wf(T.LEADS,G+' WF',G,{actions:[{type:'ScheduleCall',standaloneActionId:sid}]}),'workflow rule'); const wid=w.j?.data?.id; out.wf=w.s+' '+(wid||w.t.slice(0,300)); if(!wid) return out;
out.on=(await api('o','POST',`/workflow/rules/${wid}/activate`)).s;
const L=await X.lead('o',G+' lead',{}); const id=L.j?.data?.id; out.lead=id; await sleep(25000);
const ex=(await X.executions(id)).find(e=>e.ruleId===wid); out.exec=ex&&{o:ex.outcome,d:(ex.dispatches||[]).map(d=>[d.actionType,d.status,d.lastError&&d.lastError.slice(0,150),String(d.responseBodyTruncated).slice(0,120)])};
const list=arr((await api('o','GET','/workflow/actions?take=200')).j?.data).find(a=>a.id===sid); out.usage=list&&{usedBy:list.usedByCount??list.usageCount??list.rules?.length};
return out;
