const T='88e8ea44-1658-4df3-9930-d0902b91073d', STD='1b55c25d-eb27-4046-afd1-b292398b435b', CS='7e1ac409-58b0-41ab-97e1-0e7d5c8c5158';
const IF='l3/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1)); const o={};
const LED=s=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${s} (Desk, lane 3)\n`);
if(!I.D16){ const c=await api('POST','/desk/departments',{name:'QA RT18 3016 dept',visibility:'private',description:'QA RT18 lane3, deleted in test'}); o.dept=c.s; I.D16=c.j&&c.j.data&&c.j.data.id; SAVE(); if(I.D16) LED('department "QA RT18 3016 dept" '+I.D16); await sleep(2000); }
if(!I.VR16){ const r=await api('POST','/modules/'+T+'/validation-rules',{name:'QA RT18 3016 dept rule',description:'qa rt18 lane3',layoutId:STD,departmentIds:[I.D16,CS],primaryField:'subject',status:'active',kind:'criteria',mode:'block',errorPlacement:'field',fieldVerification:false,applyToHelpCenter:false,branches:[{when:null,check:{op:'startsWith',field:'subject',value:'QA RT18 3016X'},message:{en:'QA RT18 3016 refused'},triggerOn:'match'}]});
 o.vr=r.s+' '+(r.s>=300?r.t.slice(0,300):''); I.VR16=r.j&&r.j.data&&r.j.data.id; SAVE(); if(I.VR16) LED('validation rule "QA RT18 3016 dept rule" '+I.VR16+' (Tickets, Standard; departments QA RT18 3016 dept + Customer Support) ACTIVE'); }
if(!I.D16del){ const dis=await api('POST','/desk/departments/'+I.D16+'/disable',{transfer_to_department_id:CS}); o.disable=dis.s+' '+dis.t.slice(0,150);
 const del=await api('DELETE','/desk/departments/'+I.D16,{transfer_to_department_id:CS}); o.del=del.s+' '+del.t.slice(0,200); if(del.s<300){I.D16del=1;SAVE();LED('department '+I.D16+' disabled + deleted (for 3016)');} }
const g=(await api('GET','/modules/'+T+'/validation-rules/'+I.VR16)).j.data; o.rule={deps:g.departmentIds,status:g.status,ce:g.conditionError,w:g.warnings};
return o;
