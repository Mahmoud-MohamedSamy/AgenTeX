const T='88e8ea44-1658-4df3-9930-d0902b91073d', STD='1b55c25d-eb27-4046-afd1-b292398b435b', DA='93949fbd-f9df-4e2e-ae45-00b8dc38385b', CON='349fc131-bdf7-44a3-94b2-78f01eb8d32e';
const IF='vr/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1)); const o={};
const LED=m=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${m} (lane VR)\n`);
const sv=v=>({kind:'string',value:v});
o.con=(await api('GET','/modules/'+(arr((await api('GET','/modules')).j.data).find(x=>x.moduleKey==='contacts')||{}).id+'/records/'+CON)).s;
if(!I.T13){ const c=await api('POST','/modules/'+T+'/records',{layout_id:STD,data:[{field:'subject',value:sv('QA RT20 VR 3013 ticket')},{field:'department',value:sv(DA)},{field:'contact_id',value:sv(CON)},{field:'status',value:sv('Open')}]}); o.c=c.s+' '+c.t.slice(0,300); if(c.j&&c.j.data){I.T13=c.j.data.id;SAVE();LED(`ticket "QA RT20 VR 3013 ticket" ${I.T13} (QA AO Dept A, Desk)`);} }
const p=await api('PATCH','/modules/'+T+'/records/'+I.T13,{data:[{field:'status',value:sv('QA NDC Reject')}]}); o.patchNoReason=p.s+' '+p.t.slice(0,400);
let d=(await api('GET','/modules/'+T+'/records/'+I.T13)).j.data; o.layout=d.layout_id||d.layoutId; o.statusNow=((d.data.find(x=>x.field==='status')||{}).value||{}).value;
return o;
