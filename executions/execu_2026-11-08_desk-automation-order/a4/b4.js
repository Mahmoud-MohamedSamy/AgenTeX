const R={};const cut=(x,n=300)=>String(typeof x==='string'?x:JSON.stringify(x)).slice(0,n);const S=v=>({kind:'string',stringValue:v});
const TOK=JSON.parse(fs.readFileSync('../a4/webhook-token.json','utf8')).uuid;
// O2 with the right format; read description through the desk ticket API
const ro=await mkRule('O2c',{kind:'RecordCreated'},[{type:'FieldUpdate',fieldUpdates:{description:S('QA WF O2 [${subject}]')}}]);
const tp=await mkTicket('O2c',{},'plain'),ti=await mkTicket('O2c',{},'{{recipient_email}} ${description} #{7*7} ${owner}');
await waitExec(tp.id,1,45);await waitExec(ti.id,1,45);await sleep(4000);
const rd=async id=>{const a=(await api('GET','/modules/'+T+'/records/'+id)).j?.data?.data||[];const d=a.find(x=>x.field==='description');const b=(await api('GET','/desk/tickets/'+id)).j?.data;return {rec:d&&cut(d.value,200),desk:b&&cut(b.description||b.description_html||b.descriptionText,200)}};
R.O2={rule:ro.s+(ro.err||''),plain:await rd(tp.id),injected:await rd(ti.id)};
// L1: does Test rule read the sample record? rule matches priority=high; ticket has priority high; fields empty
const rl=await mkRule('L1e',{kind:'RecordCreated'},[{type:'FieldUpdate',fieldUpdates:{description:S('L1e')}}],{isActive:false,criteria:{kind:'PicklistMatch',field:'priority',operator:'In',values:[{kind:'string',stringValue:'high'}]}});
R.L1e_rule=rl.s+(rl.err||'');
const th=await mkTicket('L1e',{priority:'high'},'record');
const x=await api('POST','/workflow/rules/'+rl.id+'/execute',{recordId:th.id,triggerKind:'RecordCreated',fields:{}});R.L1_recordOnly=x.s+' '+cut(x.j?.data||x.t,200);
const y=await api('POST','/workflow/rules/'+rl.id+'/execute',{recordId:th.id,triggerKind:'RecordCreated',fields:{subject:S('QA AO WF L1e record'),priority:S('high')}});R.L1_typed=y.s+' '+cut(y.j?.data||y.t,200);
// L6: delayed action in Test rule
const r6=await mkRule('L6',{kind:'RecordCreated'},[{type:'Webhook',method:'POST',url:'https://webhook.site/'+TOK,bodyTemplate:'{}',headers:{},timeoutSeconds:10,delaySeconds:120}],{isActive:false});
const z=await api('POST','/workflow/rules/'+r6.id+'/execute',{recordId:'rec-sample',triggerKind:'RecordCreated',fields:{subject:S('QA AO WF L6 x')}});R.L6=r6.s+' '+z.s+' '+cut(z.j?.data||z.t,400);
return R;
