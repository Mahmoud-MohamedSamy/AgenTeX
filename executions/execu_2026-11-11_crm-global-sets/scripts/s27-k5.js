const crit=v=>({kind:'Comparison',field:'qa_gs1111_tier',operator:'Equal',negate:null,caseInsensitive:null,stringValue:null,value:{kind:'string',stringValue:v,intValue:null,doubleValue:null,boolValue:null,timestampValue:null,listValue:null},values:null,operands:null});
await api('PATCH','/workflow/rules/'+I.W,{criteria:crit('Gold')}); const on=await api('POST','/workflow/rules/'+I.W+'/activate'); const w=(await api('GET','/workflow/rules/'+I.W)).j.data;
const mk=async tag=>{const x=await api('POST','/modules/'+L+'/records',rec({first_name:'QA GS1111',last_name:tag,qa_gs1111_tier:'Gold'})); const id=x.j&&x.j.data&&(x.j.data.id||x.j.data.record.id); if(id)LED('record '+tag+' '+id); return id;};
let va='?',vb='?';
try { const a=await mk('K5c Gold'); for(let i=0;i<6&&va!=='Silver';i++){await sleep(5000); va=await recVal(L,a,'qa_gs1111_tier');}
 RES('K5', va==='Silver'?'Pass':'Fail','rule active ('+SR(on)+', criteria '+w.criteria.value.stringValue+', active '+w.isActive+'): new QA lead Gold → '+va+' (expected Silver)');
 const rm=await api('POST','/global-sets/'+I.T+'/values/remove',{values:['Silver']}); const b=await mk('K5d Gold'); for(let i=0;i<6&&vb!=='Silver';i++){await sleep(5000); vb=await recVal(L,b,'qa_gs1111_tier');}
 RES('K5b', vb==='Silver'?'Fail':'Info','after Silver moved to Unused ('+SR(rm)+') the rule still sets Silver: new QA lead Gold → '+vb+(vb==='Silver'?' — a workflow wrote a value the set no longer offers (users cannot pick it; the field shows an unused value)':''));
} finally { await api('POST','/global-sets/'+I.T+'/values/restore',{values:['Silver']}); await api('POST','/workflow/rules/'+I.W+'/deactivate'); const off=await api('PATCH','/workflow/rules/'+I.W,{criteria:crit('Bronze')}); const c=(await api('GET','/workflow/rules/'+I.W)).j.data; LED('rule '+I.W+' off again: '+c.isActive+' criteria '+c.criteria.value.stringValue); }
return {va,vb};
