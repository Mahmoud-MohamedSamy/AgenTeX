// Step 7c (user OK): Customer Happiness ON scoped to QA AS6 Dept A (original saved ../e1-happiness-orig.json), then 2 tickets for +qae1, owner A2.
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));const F='../e1.json';const M=JSON.parse(fs.readFileSync(F,'utf8'));const R={};
const hs=(await api('GET','/desk/happiness/settings')).j.data;if(!fs.existsSync('../e1-happiness-orig.json'))fs.writeFileSync('../e1-happiness-orig.json',JSON.stringify(hs,null,1));
const ro=['expiry_days_min','expiry_days_max','question_max_length','public_page_configured','supervisors_max','closed_email_subject_max','closed_email_body_max','resend_after_hours_max','option_icons','option_label_max','option_text_max','option_image_max_bytes'];
const hb={...hs,is_enabled:true,department_scope_enabled:true,department_ids:[DA]};for(const k of ro)delete hb[k];const p=await api('PUT','/desk/happiness/settings',hb);R.happiness=p.s+(p.s>=300?' '+E(p).slice(0,250):'');
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' E2E-1 7c: Customer Happiness ON scoped to QA AS6 Dept A (restore ../e1-happiness-orig.json).\n');
const NEW='mahmoud.mmohamedsamy+qae1@gmail.com';
const mk=async(subj)=>{const r=await api('POST','/modules/'+T+'/records',{data:fields({subject:subj,description:'QA E2E-1 step 7c',department:DA,status:'Open',priority:'medium',owner:A2,contact_id:M.contact,email:NEW,channel:'web'})});const id=r.j?.data?.id;if(!id)throw new Error(E(r));pbm.tickets.push(id);pbSave();return id;};
M.c1=await mk('QA AO E1 7c normal close '+U);M.c2=await mk('QA AO '+M.k+' 7c blueprint close');fs.writeFileSync(F,JSON.stringify(M,null,1));
await sleep(8000);
for(const [k,id] of [['c1',M.c1],['c2',M.c2]]){const o=await rec(id);const bs=((await api('GET','/modules/'+T+'/records/'+id+'/blueprint-state')).j?.data?.states||[])[0];R[k]={num:o.ticket_number,owner:nm(o.owner),blueprint:bs?bs.activeStates:null};}
return R;
