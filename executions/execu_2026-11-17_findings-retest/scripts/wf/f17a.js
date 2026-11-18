eval(fs.readFileSync('wf/lib.js','utf8'));const o={};
const CALLS='f7e488b5-0232-42fd-811c-1f24356af653',CL='fdb13486-6c74-4a80-8401-c9a25255dfe1';
const ts={kind:'timestamp',timestampValue:new Date(Date.now()+86400000).toISOString()};
const r=await mkRule('F17',{kind:'RecordCreated'},[{type:'CreateRecord',targetModuleId:CALLS,targetLayoutId:CL,fieldMappings:{subject:S('QA RT21 WF call for ${subject}'),call_start_time:ts,call_status:S('scheduled'),contact_id:S('${contact_id}'),department:S('${department}')}}],{isActive:true});o.rule=r.res+' '+r.id;
if(!r.id)return o;
const t=await mkTicket('F17',{},'no contact');o.t=t.s+' '+now();
await sleep(25000);
o.ex=(await execsRaw(t.id)).filter(e=>e.ruleId===r.id).map(e=>({id:e.id,out:e.outcome,err:e.errorMessage,det:e.details,d:e.dispatches.map(d=>d.actionType+':'+d.status+' '+(d.lastError||'')+' '+JSON.stringify(d).slice(0,400))}));
o.deact=await deact(r.id);o.tid=t.id;o.num=(await api('GET','/desk/tickets/'+t.id)).j?.data?.ticket_number;
// any call created?
const c=arr((await api('GET','/modules/'+CALLS+'/records?take=10&search='+encodeURIComponent('QA RT21 WF call'))).j?.data);o.calls=c.length;
save('f17a',{...o,rid:r.id});return o;
