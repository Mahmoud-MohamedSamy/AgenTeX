const T='88e8ea44-1658-4df3-9930-d0902b91073d', STD='1b55c25d-eb27-4046-afd1-b292398b435b';
const IF='l3/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1)); const o={};
const LED=s=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${s} (Desk, lane 3)\n`);
const FN='qa_rt18_l3_when';
let F=arr((await api('GET','/modules/'+T+'/fields')).j.data).find(f=>f.fieldName===FN);
if(!F){ const r=await api('POST','/modules/'+T+'/fields',{fields:[{fieldName:FN,datatypeKey:'single_line',labels:{en:'QA RT18 L3 when'},datatypeOptions:{},required:false,unique:false,uniquePeerModuleIds:[]}]}); o.field=r.s+' '+r.t.slice(0,300);
 F=arr((await api('GET','/modules/'+T+'/fields')).j.data).find(f=>f.fieldName===FN); if(F){LED('field "QA RT18 L3 when" '+FN+' '+F.id+' (Tickets)');} }
if(!F) return o; I.F14=F.id; SAVE();
if(!I.VR14){ const r=await api('POST','/modules/'+T+'/validation-rules',{name:'QA RT18 3014 when rule',description:'qa rt18 lane3',layoutId:STD,departmentIds:null,primaryField:'subject',status:'active',kind:'criteria',mode:'block',errorPlacement:'field',fieldVerification:false,applyToHelpCenter:false,branches:[{when:{op:'eq',field:FN,value:'x'},check:{op:'startsWith',field:'subject',value:'QA RT18 W'},message:{en:'QA RT18 3014 refused'},triggerOn:'match'}]});
 o.vr=r.s+' '+(r.s>=300?r.t.slice(0,400):''); const id=r.j&&r.j.data&&r.j.data.id; if(id){I.VR14=id;SAVE();LED('validation rule "QA RT18 3014 when rule" '+id+' (Tickets, Standard; Applies when qa_rt18_l3_when = x) ACTIVE');} }
if(!I.VR14) return o; const g=(await api('GET','/modules/'+T+'/validation-rules/'+I.VR14)).j.data; o.ruleBefore={status:g.status,ce:g.conditionError};
const d=await api('DELETE','/modules/'+T+'/fields/'+I.F14); o.delField=d.s+' '+d.t.slice(0,400);
const still=arr((await api('GET','/modules/'+T+'/fields')).j.data).find(f=>f.fieldName===FN); o.fieldStillThere=!!still;
const g2=(await api('GET','/modules/'+T+'/validation-rules/'+I.VR14)).j.data; o.ruleAfter={status:g2.status,ce:g2.conditionError,w:g2.warnings};
return o;
