const MID='841043e1-c078-41f9-8d6e-dfd61bee45c3', LID='c5bbf73c-0a86-48b4-a8bc-4f394b4e11e5';
const IF='vr/ids.json'; const I=JSON.parse(fs.readFileSync(IF,'utf8')); const SAVE=()=>fs.writeFileSync(IF,JSON.stringify(I,null,1)); const sv=v=>({kind:'string',value:v});
if(!I.L18){ const c=await api('POST','/modules/'+MID+'/records',{layout_id:LID,data:[{field:'first_name',value:sv('QA RT20 VR')},{field:'last_name',value:sv('QA RT20 VR 3018 edit')},{field:'qa_rt18v_text',value:sv('ok text')}]}); if(c.j&&c.j.data){I.L18=c.j.data.id;SAVE();fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} lead "QA RT20 VR 3018 edit" ${I.L18} (CRM Leads, layout QA RT18 VR Layout) (lane VR)\n`);} else return c.t.slice(0,300);}
const p=await api('PATCH','/modules/'+MID+'/records/'+I.L18,{data:[{field:'qa_rt18v_text',value:sv('BAD-api')}]});
return {id:I.L18, apiPatch:p.s+' '+p.t.slice(0,300)};
