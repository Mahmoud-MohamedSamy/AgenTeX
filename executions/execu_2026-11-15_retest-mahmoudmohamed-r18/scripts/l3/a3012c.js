const T='88e8ea44-1658-4df3-9930-d0902b91073d', STD='1b55c25d-eb27-4046-afd1-b292398b435b', DA='93949fbd-f9df-4e2e-ae45-00b8dc38385b', CON='349fc131-bdf7-44a3-94b2-78f01eb8d32e';
const IF='l3/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1)); const o={};
const LED=s=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${s} (Desk, lane 3)\n`);
const E=r=>r.s+' '+(r.s>=300?r.t.slice(0,500):'');
if(!I.VR12){ const r=await api('POST','/modules/'+T+'/validation-rules',{name:'QA RT18 3012 subject not BAD',description:'qa rt18 lane3',layoutId:STD,departmentIds:null,primaryField:'subject',status:'active',kind:'criteria',mode:'block',errorPlacement:'field',fieldVerification:false,applyToHelpCenter:false,branches:[{when:null,check:{op:'startsWith',field:'subject',value:'QA RT18 BAD'},message:{en:'QA RT18: subject cannot start with QA RT18 BAD'},triggerOn:'match'}]});
 o.vr=E(r); const id=r.j&&r.j.data&&r.j.data.id; if(id){I.VR12=id;SAVE();LED('validation rule "QA RT18 3012 subject not BAD" '+id+' (Tickets, Standard layout) ACTIVE');} }
const g=(await api('GET','/modules/'+T+'/validation-rules/'+I.VR12)).j.data; o.vrState={status:g.status,ce:g.conditionError,w:g.warnings,lay:g.layoutId};
// control: plain create with bad subject
const sv=v=>({kind:'string',value:v});
const c=await api('POST','/modules/'+T+'/records',{layout_id:STD,data:[{field:'subject',value:sv('QA RT18 BAD control')},{field:'department',value:sv(DA)},{field:'contact_id',value:sv(CON)},{field:'email',value:sv('qa-rt18-l3@example.com')},{field:'status',value:sv('Open')}]}); o.controlCreate=E(c);
if(c.j&&c.j.data&&c.j.data.id) LED('ticket "QA RT18 BAD control" '+c.j.data.id+' (should not exist)');
return o;
