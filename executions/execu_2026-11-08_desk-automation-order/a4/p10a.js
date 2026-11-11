const ACC='784400e1-4a2a-42c2-b4f3-7ca56e79828a';
const r=await api('POST',`/modules/${ACC}/records`,{data:[{field:'account_name',value:enc('QA AO WF P10 QAAOWF-P10 account')},{field:'name',value:enc('QA AO WF P10 QAAOWF-P10 account')}]});const aY=r.j?.data?.id;if(aY)track('account',aY,'P10');
const ru=await mkRule('P10a2',{kind:'RecordCreated'},[{type:'AddTicketComment',commentBody:'QA AO WF P10a2 fired',commentPublic:false}],{criteria:{kind:'StringMatch',field:'account_id.account_name',operator:'Contains',stringValue:'QAAOWF-P10',caseInsensitive:false}});
const y=await mkTicket('P10a2',{account_id:aY},'ticket Y');const n=await mkTicket('P10a2',{},'ticket N');await sleep(20000);
const f=async id=>(await execs(id)).filter(z=>z.rule===ru.id).map(z=>z.outcome).join(',')||'none';
return {acc:r.s,rule:ru.s+(ru.err||''),Y:await f(y.id),N:await f(n.id)};
