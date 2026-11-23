eval(fs.readFileSync('w2/lib.js','utf8'));
const QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b',CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158',NEW='dbdbd304-652f-4bf1-b4af-f73065323d5e',ACC='726771f4-c0a2-401c-8fde-3481e16881b1',TA='110de3b0-47e1-43cd-95e5-c59d439e00f4';
const o={};const tg=async id=>((await api('GET',`/desk/tickets/${id}/tags`)).j?.data?.tags||[]).map(x=>x.name+'@'+(x.department_id===QAO?'QAO':x.department_id===CS?'CS':x.department_id));
const exs=async(id,rid)=>(await execsRaw(id)).filter(e=>e.ruleId===rid).map(e=>e.id.slice(0,8)+' '+e.outcome+' '+e.dispatches.map(d=>d.actionType+':'+d.status+(d.lastError?' '+d.lastError:'')+(d.responseBodyTruncated?' body='+d.responseBodyTruncated.slice(0,150):'')).join(';'));
// (a) Remove Tags
const REM='c840c74c-9724-4af3-9915-1121c645857e',TID='d83c8c58-7531-46a0-8571-b7bbbfe35605';
o.remBefore=await tg(TID);o.remAct=await act(REM);
await api('PATCH',`/modules/${T}/records/${TID}`,{data:[{field:'priority',value:enc('medium')}]});await sleep(20000);
o.remEx=await exs(TID,REM);o.remAfter=await tg(TID);o.remDeact=await deact(REM);
// (b) single-dept rule saved with another dept's tag
const bad=await mkRule('3058 bad',{kind:'RecordUpdated'},[{type:'AddTags',tagIds:[ACC],mode:'append'}],{isActive:false,departmentIds:[QAO]});o.singleDeptOtherTag=bad.res+' '+(bad.id||'');
// (c) multi-dept rule mixing tags on a QAO ticket, (d) only the wrong tag
const mix=await mkRule('3058 mix',{kind:'RecordUpdated'},[{type:'AddTags',tagIds:[ACC,TA],mode:'append'}],{isActive:false,departmentIds:[QAO,CS]});
const wro=await mkRule('3058 wrong',{kind:'RecordUpdated'},[{type:'AddTags',tagIds:[ACC],mode:'append'}],{isActive:false,departmentIds:[QAO,CS]});
const tm=await mkTicket('3058 mix',{department:QAO,priority:'low'},'qao');const tw=await mkTicket('3058 wrong',{department:QAO,priority:'low'},'qao');await sleep(5000);
o.mixAct=await act(mix.id);o.wroAct=await act(wro.id);
await api('PATCH',`/modules/${T}/records/${tm.id}`,{data:[{field:'priority',value:enc('high')}]});await api('PATCH',`/modules/${T}/records/${tw.id}`,{data:[{field:'priority',value:enc('high')}]});
await sleep(22000);
o.mix={rule:mix.id,num:tm.num,ex:await exs(tm.id,mix.id),tags:await tg(tm.id)};o.wrong={rule:wro.id,num:tw.num,ex:await exs(tw.id,wro.id),tags:await tg(tw.id)};
o.d1=await deact(mix.id);o.d2=await deact(wro.id);
save('t4',o);return o;
