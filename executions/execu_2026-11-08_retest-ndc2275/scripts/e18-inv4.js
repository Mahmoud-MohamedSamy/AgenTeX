module.exports=async()=>{const R={};
 const f=await api('GET','/modules/'+T+'/fields');for(const x of f.j.data)if(/customer_responded|first_response_at|closed_time|response_due/.test(x.apiName))R[x.apiName]={label:x.labels&&x.labels.en,type:x.datatypeKey,sysManaged:x.isSystemManaged,system:x.isSystemField,caps:x.capabilities&&x.capabilities.canEditProperties};
 // values on recent tickets
 const r=await api('GET','/modules/'+T+'/records?page=1&per_page=100&sort_by=created_at&sort_dir=desc');const L=arr(r.j.data).map(fl);R.recentWithCR=L.filter(o=>o.customer_responded!=null).slice(0,5).map(o=>({no:o.ticket_number,c:String(o.created_at).slice(0,16),cr:o.customer_responded,ch:o.channel}));R.recentCount=L.length;
 // waiting tickets per QA dept
 for(const [k,d] of [['DA',IDS.DA],['DB',IDS.DB]]){const q=await api('GET','/desk/departments/'+d+'/round-robin-preferences');R['prefs'+k]=q.s===200?{offline:q.j.data.assign_to_offline_agents??q.j.data.offline_agents_allowed,backlogs:q.j.data.assign_backlogs,limit:q.j.data.backlog_limit,thr:q.j.data.department_threshold_enabled,athr:q.j.data.agent_threshold_enabled,incoming:q.j.data.incoming_mode,keys:Object.keys(q.j.data).join(',')}:q.s;}
 const rr=await api('GET','/desk/assignment-rules?type=round_robin&department_id='+IDS.DA);R.rulesDA=(rr.j.data.rules||[]).map(x=>x.name+(x.is_active?'*':''));
 const rr2=await api('GET','/desk/assignment-rules?type=round_robin&department_id='+IDS.DB);R.rulesDB=(rr2.j.data.rules||[]).map(x=>x.name+(x.is_active?'*':''));
 return R;};
