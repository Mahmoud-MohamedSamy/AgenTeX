const T='88e8ea44-1658-4df3-9930-d0902b91073d', STD='1b55c25d-eb27-4046-afd1-b292398b435b', DA='93949fbd-f9df-4e2e-ae45-00b8dc38385b', CON='349fc131-bdf7-44a3-94b2-78f01eb8d32e';
const IF='l3/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1)); const o={};
const s=(await api('GET','/desk/ticket-statuses')).j.data.statuses; o.reject=s.filter(x=>/Reject/i.test(x.value)).map(x=>x.value+'/'+x.type);
const R='4e50a48f-3df1-4dc2-aefc-02d16e021283'; const g=(await api('GET','/modules/'+T+'/validation-rules/'+R)).j.data; o.rule={status:g.status,layoutId:g.layoutId,ce:g.conditionError,w:g.warnings,mod:g.lastModifiedAt};
const sv=v=>({kind:'string',value:v});
if(!I.T13){ const c=await api('POST','/modules/'+T+'/records',{layout_id:STD,data:[{field:'subject',value:sv('QA RT18 3013 ticket')},{field:'department',value:sv(DA)},{field:'contact_id',value:sv(CON)},{field:'email',value:sv('qa-rt18-l3@example.com')},{field:'status',value:sv('Open')}]}); o.c=c.s; if(c.j&&c.j.data){I.T13=c.j.data.id;SAVE();fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ticket "QA RT18 3013 ticket" ${I.T13} (QA AO Dept A) (Desk, lane 3)\n`);} }
const p=await api('PATCH','/modules/'+T+'/records/'+I.T13,{data:[{field:'status',value:sv('QA NDC Reject')}]}); o.patchNoReason=p.s+' '+p.t.slice(0,350);
const d=(await api('GET','/modules/'+T+'/records/'+I.T13)).j.data.data; o.statusNow=((d.find(x=>x.field==='status')||{}).value||{}).value;
return o;
