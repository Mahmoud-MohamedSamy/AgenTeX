const T='88e8ea44-1658-4df3-9930-d0902b91073d', STD='1b55c25d-eb27-4046-afd1-b292398b435b', DA='93949fbd-f9df-4e2e-ae45-00b8dc38385b';
const IF='vr/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1)); const o={};
const LED=m=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${m} (lane VR)\n`);
const sv=v=>({kind:'string',value:v}); I.tk=I.tk||{};
const mk=async(k,lay,vals)=>{ const data=[{field:'subject',value:sv('QA RT20 VR 1988 '+k)},{field:'department',value:sv(DA)},{field:'status',value:sv('Open')},...Object.entries(vals).map(([f,v])=>({field:f,value:sv(v)}))];
 const r=await api('POST','/modules/'+T+'/records',{layout_id:lay,data}); const id=r.j&&r.j.data&&r.j.data.id; if(id){I.tk[k]=id;SAVE();LED('ticket "QA RT20 VR 1988 '+k+'" '+id);}
 const det=r.j&&r.j.error&&r.j.error.details; return r.s+' '+(r.s>=300?(det?JSON.stringify(det.map(x=>[x.path,x.type,x.message])):r.t.slice(0,300)):'created'); };
const L=I.layout;
o.T1_refund_noOrder=await mk('T1 refund no order',L,{qa_rt20vr_type:'Refund'});
o.T2_refund_BAD=await mk('T2 refund BAD',L,{qa_rt20vr_type:'Refund',qa_rt20vr_order:'BAD-77'});
o.T3_refund_ok=await mk('T3 refund ok',L,{qa_rt20vr_type:'Refund',qa_rt20vr_order:'ORD-77'});
o.T4_question_noOrder=await mk('T4 question',L,{qa_rt20vr_type:'Question'});
o.T4b_question_BAD=await mk('T4b question BAD',L,{qa_rt20vr_type:'Question',qa_rt20vr_order:'BAD-1'});
o.T5_myLayout_urgent=await mk('T5 my layout urgent',L,{priority:'urgent'});
o.T5b_std_urgent=await mk('T5b standard urgent',STD,{priority:'urgent'});
o.T6_l1A_l2B=await mk('T6 dep bad level2',L,{qa_rt20vr_l1:'A1',qa_rt20vr_l2:'B2'});
o.T6b_chain_ok=await mk('T6b dep chain ok',L,{qa_rt20vr_l1:'B1',qa_rt20vr_l2:'B2',qa_rt20vr_l3:'C3',qa_rt20vr_l4:'C4',qa_rt20vr_l5:'C5',qa_rt20vr_l6:'C6',qa_rt20vr_l7:'C7'});
o.T6c_level7_bad=await mk('T6c dep bad level7',L,{qa_rt20vr_l1:'B1',qa_rt20vr_l2:'B2',qa_rt20vr_l3:'C3',qa_rt20vr_l4:'C4',qa_rt20vr_l5:'C5',qa_rt20vr_l6:'C6',qa_rt20vr_l7:'A7'});
// cycle
const c=await api('POST','/modules/'+T+'/dependency-maps',{controllingFieldId:I.fields.qa_rt20vr_l7,dependentFieldId:I.fields.qa_rt20vr_l1,valueMap:{A7:['A1'],B7:['B1'],C7:['C1']}}); o.cycle=c.s+' '+c.t.slice(0,300);
if(c.j&&c.j.data){ const d=await api('DELETE','/modules/'+T+'/dependency-maps/'+c.j.data.id); o.cycleDeleted=d.s; LED('dependency map l7→l1 (cycle) '+c.j.data.id+' created then deleted '+d.s); }
return o;
