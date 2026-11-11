const w=(await api('GET','/workflow/rules/'+I.W)).j.data; const put=async(crit,active)=>api('PUT','/workflow/rules/'+I.W,{...w,criteria:{kind:'Comparison',field:'qa_gs1111_tier',operator:'Equal',value:{kind:'string',stringValue:crit},negate:null},isActive:active});
let r=await put('Gold',true); const pa=SR(r); if(r.s>=300){ r=await api('PATCH','/workflow/rules/'+I.W,{isActive:true,criteria:{kind:'Comparison',field:'qa_gs1111_tier',operator:'Equal',value:{kind:'string',stringValue:'Gold'},negate:null}}); }
const act=SR(r);
const mk=async tag=>{const x=await api('POST','/modules/'+L+'/records',rec({first_name:'QA GS1111',last_name:tag,qa_gs1111_tier:'Gold'})); const id=x.j&&x.j.data&&(x.j.data.id||x.j.data.record.id); if(id)LED('record '+tag+' '+id); return id;};
const a=await mk('K5a Gold'); await sleep(8000); const va=await recVal(L,a,'qa_gs1111_tier');
RES('K5', va==='Silver'?'Pass':'Info','rule (criteria Gold, action Tier = Silver) active: '+act+' (PUT '+pa+'); new lead Gold → '+va);
// K5b: Silver moved to unused (allowed: only views are checked), rule still writes Silver
const rm=await api('POST','/global-sets/'+I.T+'/values/remove',{values:['Silver']}); const b=await mk('K5b Gold'); await sleep(8000); const vb=await recVal(L,b,'qa_gs1111_tier');
const runs=await api('GET','/workflow/rules/'+I.W+'/executions?limit=5');
RES('K5b', 'Info','Silver moved to Unused → '+SR(rm)+'; rule still sets Silver; new lead Gold → '+vb+' (a workflow writes a value the set no longer offers); runs '+SR(runs)+' '+JSON.stringify(arr(runs.j&&runs.j.data).slice(0,2).map(x=>x.status||x.outcome)).slice(0,200));
await api('POST','/global-sets/'+I.T+'/values/restore',{values:['Silver']});
const off=await api('PATCH','/workflow/rules/'+I.W,{isActive:false}); const off2=off.s>=300?await put('Gold',false):off; const chk=(await api('GET','/workflow/rules/'+I.W)).j.data.isActive;
LED('workflow rule '+I.W+' switched off again: isActive='+chk);
return {chk};
