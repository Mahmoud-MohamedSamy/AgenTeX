const T='88e8ea44-1658-4df3-9930-d0902b91073d', TECH='19510fdc-91f3-4a7a-8888-153f1318b765', C='de7195a2-369e-48c5-b03f-b8e37d6c5fb2';
const S=v=>({kind:'string',value:v}); const LED=s=>fs.appendFileSync('ledger.md','- '+new Date().toISOString().slice(0,19)+' DESK '+s+'\n');
const r = await api('POST','/modules/'+T+'/records',{data:[{field:'subject',value:S('QA RT16 2844 API ticket')},{field:'department',value:S(TECH)},{field:'contact_id',value:S(C)},{field:'status',value:S('Open')}]});
const id=r.j&&r.j.data&&r.j.data.id; if(id) LED('ticket "QA RT16 2844 API ticket" '+id);
const g = await api('GET','/desk/tickets/'+id); const rec = await api('GET','/modules/'+T+'/records/'+id);
return {s:r.s,id,num:g.j&&g.j.data&&g.j.data.ticket_number, fields:Object.fromEntries((rec.j.data.data||[]).map(d=>[d.field,d.value&&d.value.value]))};
