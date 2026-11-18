const T='88e8ea44-1658-4df3-9930-d0902b91073d', STD='1b55c25d-eb27-4046-afd1-b292398b435b';
const IF='l3/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1));
if(I.VR18) return 'exists';
const r=await api('POST','/modules/'+T+'/validation-rules',{name:'QA RT18 3018 description not BAD',description:'qa rt18 lane3',layoutId:STD,departmentIds:null,primaryField:'description',status:'active',kind:'criteria',mode:'block',errorPlacement:'field',fieldVerification:false,applyToHelpCenter:false,branches:[{when:null,check:{op:'startsWith',field:'description',value:'QA RT18 BAD'},message:{en:'QA RT18: description cannot start with QA RT18 BAD'},triggerOn:'match'}]});
const id=r.j&&r.j.data&&r.j.data.id; if(id){I.VR18=id;SAVE();fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} validation rule "QA RT18 3018 description not BAD" ${id} (Tickets, Standard) ACTIVE (Desk, lane 3)\n`);}
return r.s+' '+r.t.slice(0,200);
