const QAO='93949fbd-f9df-4e2e-ae45-00b8dc38385b',CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158',ACC='726771f4-c0a2-401c-8fde-3481e16881b1',TA='110de3b0-47e1-43cd-95e5-c59d439e00f4';
const o={};const AT=(t,d=0)=>[{type:'AddTags',tagIds:t,mode:'append',order:0,delaySeconds:d}];
const tg=async id=>((await api('GET',`/desk/tickets/${id}/tags`)).j?.data?.tags||[]).map(x=>x.name+'@'+(x.department_id===QAO?'QAO':x.department_id===CS?'CS':x.department_id));
const exs=async(id,rid)=>(await execsRaw(id)).filter(e=>e.ruleId===rid).map(e=>({exec:e.id,outcome:e.outcome,d:(e.dispatches||[]).map(d=>{const x={...d};delete x.requestBodyTruncated;return x;})}));
const cases=[['3110 wrong',AT([ACC])],['3110 mix',AT([TA,ACC])],['3110 delayed',AT([ACC],60)],['3110 rem',[{type:'RemoveTags',tagIds:[TA],order:0,delaySeconds:0}]]];
const R={};for(const [tag,acts] of cases){const r=await mkRule(tag,{kind:'RecordUpdated'},acts,{isActive:false,departmentIds:[QAO,CS]});const t=await mkTicket(tag,{department:QAO,priority:'low'},'qao');R[tag]={rule:r.id,res:r.res,tid:t.id,num:t.num};}
await sleep(5000);
// rem ticket needs TA first
await api('POST',`/desk/tickets/${R['3110 rem'].tid}/tags`,{tag_ids:[TA]}).then(x=>o.remSeed=x.s);o.remSeedTags=await tg(R['3110 rem'].tid);
for(const k in R){o['act '+k]=await act(R[k].rule);}
for(const k in R)await api('PATCH',`/modules/${T}/records/${R[k].tid}`,{data:[{field:'priority',value:enc('high')}]});
await sleep(25000);for(const k in R){R[k].ex25=await exs(R[k].tid,R[k].rule);R[k].tags25=await tg(R[k].tid);}
await sleep(60000);for(const k in R){R[k].ex85=await exs(R[k].tid,R[k].rule);R[k].tags85=await tg(R[k].tid);}
for(const k in R)o['deact '+k]=await deact(R[k].rule);
o.R=R;save('r3110',o);log(JSON.stringify(o,null,1));
