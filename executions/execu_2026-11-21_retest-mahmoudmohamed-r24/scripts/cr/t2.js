eval(fs.readFileSync('cr/lib.js','utf8'));const o={};const rid=JSON.parse(fs.readFileSync(OUTD+'t1-rules.json','utf8'));
const R=async(tag,actions)=>{const r=await mkRule(tag,{kind:'RecordCreated'},actions,{isActive:true});o[tag]=r.res+' '+(r.id||'');return r.id;};
rid.sysTicket=await R('3052 sysfill',[{type:'CreateRecord',targetModuleId:T,fieldMappings:{subject:S('QA RT20 CR child of ${subject}'),status:S('Open')}}]);
rid.sysStatus=await R('3052 sysstatus',[{type:'CreateRecord',targetModuleId:T,fieldMappings:{subject:S('QA RT20 CR child2 of ${subject}'),status:S('${qa_ndc_tkt_pnr_no}')}}]);
delete rid.sysTask;fs.writeFileSync(OUTD+'t1-rules.json',JSON.stringify(rid));o.rid=rid;
const g=(await api('GET','/workflow/rules/'+rid.saved)).j?.data;o.savedRuleAction=g?.actions?.map(a=>({type:a.type,sa:a.standaloneActionId,tm:a.targetModuleId}));
return o;
