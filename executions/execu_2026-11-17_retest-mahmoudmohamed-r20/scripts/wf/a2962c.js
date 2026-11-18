eval(fs.readFileSync('wf/lib.js','utf8'));
const o={};const W=h=>({type:'Webhook',order:0,delaySeconds:0,method:'POST',url:'https://qa-rt19.invalid/hook',bodyTemplate:'{}',headers:h,timeoutSeconds:5});
for(const [k,h] of [['crlf',{'X-QA':'a\r\nInjected: 1'}],['host',{Host:'evil.example'}],['ok',{'X-QA-RT19':'ok'}]]){
 const r=await api('POST','/workflow/actions',{moduleId:T,name:'QA RT19 WF 2962 saved '+k,description:null,isActive:false,action:W(h)});o['saved_'+k]=short(r);
 const id=r.j?.data?.id;if(id){led(`saved action "QA RT19 WF 2962 saved ${k}" ${id} (inactive)`);o['saved_'+k+'_id']=id;
  if(k==='ok'){const g=(await api('GET','/workflow/actions/'+id)).j?.data;const p=await api('PATCH','/workflow/actions/'+id,{action:{...g.action,headers:{'X-QA':'a\r\nInjected: 1'}}});o.savedPatchCrlf=short(p);
   const p2=await api('PUT','/workflow/actions/'+id,{...g,action:{...g.action,headers:{'X-QA':'a\r\nInjected: 1'}}});o.savedPutCrlf=short(p2);}}
}
const draft=body('2962 eval',{kind:'RecordCreated'},[W({'X-QA':'a\r\nInjected: 1'})]);
const e=await api('POST','/workflow/rules/evaluate',{rule:draft,fieldValues:[{field:'subject',value:S('QA RT19 WF 2962 eval x')}]});o.evaluate=e.s+' '+e.t.slice(0,500);
return o;
