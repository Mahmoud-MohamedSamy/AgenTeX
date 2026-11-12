const R={};const cut=(x,n=300)=>String(typeof x==='string'?x:JSON.stringify(x)).slice(0,n);const S=v=>({kind:'string',stringValue:v});
const TOK=JSON.parse(fs.readFileSync('../a4/webhook-token.json','utf8')).uuid;
// L1: does Test rule read the sample record? rule matches priority=high; ticket has priority high; fields empty
const rl=await mkRule('L1e',{kind:'RecordCreated'},[{type:'FieldUpdate',fieldUpdates:{description:S('L1e')}}],{isActive:false,criteria:{kind:'Membership',field:'priority',negate:false,values:[S('high')]}});
R.L1e_rule=rl.s+(rl.err||'');
const th=await mkTicket('L1e',{priority:'high'},'record');
const x=await api('POST','/workflow/rules/'+rl.id+'/execute',{recordId:th.id,triggerKind:'RecordCreated',fields:{}});R.L1_recordOnly=x.s+' '+cut(x.j?.data||x.t,200);
const y=await api('POST','/workflow/rules/'+rl.id+'/execute',{recordId:th.id,triggerKind:'RecordCreated',fields:{subject:S('QA AO WF L1e record'),priority:S('high')}});R.L1_typed=y.s+' '+cut(y.j?.data||y.t,200);
return R;
