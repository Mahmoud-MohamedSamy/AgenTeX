const T='88e8ea44-1658-4df3-9930-d0902b91073d', DA='93949fbd-f9df-4e2e-ae45-00b8dc38385b';
const IF='vr/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1)); const o={};
const LED=m=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${m} (lane VR)\n`);
if(!I.LR){ const r=await api('POST','/modules/'+T+'/layout-rules',{name:'QA RT20 VR 1988 LR',description:'qa rt20 lane VR',layoutId:I.layout,primaryField:'qa_rt20vr_type',status:'active',departmentIds:null,applyToHelpCenter:false,branches:[{condition:{op:'eq',field:'qa_rt20vr_type',value:'Refund'},actions:[{type:'show_sections',sections:['sec-qa-rt20vr-b']},{type:'require_fields',fields:['qa_rt20vr_order']}]}]});
 o.lr=r.s+' '+(r.s>=300?r.t.slice(0,500):''); if(r.j&&r.j.data){I.LR=r.j.data.id;SAVE();LED('layout rule "QA RT20 VR 1988 LR" '+I.LR+' (layout QA RT20 VR 1988 Layout; type=Refund → show Refund section + order mandatory) ACTIVE');} }
if(!I.VR){ const r=await api('POST','/modules/'+T+'/validation-rules',{name:'QA RT20 VR 1988 VR',description:'qa rt20 lane VR',layoutId:I.layout,departmentIds:null,primaryField:'qa_rt20vr_order',status:'active',kind:'criteria',mode:'block',errorPlacement:'field',fieldVerification:false,applyToHelpCenter:false,branches:[{when:{op:'eq',field:'qa_rt20vr_type',value:'Refund'},check:{op:'startsWith',field:'qa_rt20vr_order',value:'BAD'},message:{en:'QA RT20 VR: a Refund order number cannot start with BAD'},triggerOn:'match'}]});
 o.vr=r.s+' '+(r.s>=300?r.t.slice(0,500):''); if(r.j&&r.j.data){I.VR=r.j.data.id;SAVE();LED('validation rule "QA RT20 VR 1988 VR" '+I.VR+' (layout QA RT20 VR 1988 Layout; when type=Refund, order must not start with BAD) ACTIVE');} }
I.maps=I.maps||{};
for(let i=1;i<=6;i++){ if(I.maps[i]) continue; const a=I.fields['qa_rt20vr_l'+i], b=I.fields['qa_rt20vr_l'+(i+1)]; const j=i+1;
 const r=await api('POST','/modules/'+T+'/dependency-maps',{controllingFieldId:a,dependentFieldId:b,valueMap:{['A'+i]:['A'+j],['B'+i]:['B'+j,'C'+j],['C'+i]:['C'+j]}});
 o['map'+i]=r.s+' '+(r.s>=300?r.t.slice(0,400):''); if(r.j&&r.j.data){I.maps[i]=r.j.data.id;SAVE();LED('dependency map l'+i+'→l'+j+' '+I.maps[i]);} }
const rr=(await api('GET','/modules/'+T+'/layout-rules/'+I.LR)).j.data; o.lrSaved={status:rr.status,err:rr.definitionError,warn:rr.warnings};
const vv=(await api('GET','/modules/'+T+'/validation-rules/'+I.VR)).j.data; o.vrSaved={status:vv.status,ce:vv.conditionError};
return o;
