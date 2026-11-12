// F2: is a scheduled (delayed) Field Update accepted, and does it run after the delay?
const r=await mkRule('F2',{kind:'RecordCreated'},[{type:'FieldUpdate',delaySeconds:60,fieldUpdates:{description:{kind:'string',stringValue:'QA AO WF F2 delayed field update'}}}]);
const out={rule:r.s+(r.err?' '+r.err:'')};if(!r.id)return out;
const st=(await api('GET','/workflow/rules/'+r.id)).j?.data?.actions?.[0];out.storedDelay=st&&st.delaySeconds;
const t=await mkTicket('F2');await sleep(15000);out.at15s=(await getTicket(t.id)).description||null;
await sleep(90000);out.at105s=(await getTicket(t.id)).description||null;out.exec=(await execs(t.id)).filter(e=>e.rule===r.id).map(e=>e.outcome+' '+e.actions.join(','));
return out;
