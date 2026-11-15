// Evidence for the 2 E2E-1 findings. PHASE=make: contact +qae1, blueprint (close), T1 normal close with Happiness off; Happiness ON (Dept A) for T2 normal close + T3 blueprint close; restore Happiness.
eval(fs.readFileSync('lib-as.js','utf8'));eval(fs.readFileSync('lib-pb.js','utf8'));const F='../e1-ev.json';const M=fs.existsSync(F)?JSON.parse(fs.readFileSync(F,'utf8')):{};const save=()=>fs.writeFileSync(F,JSON.stringify(M,null,1));
const NEW='mahmoud.mmohamedsamy+qae1@gmail.com';const v=x=>({kind:'string',value:x});const k='E1EV'+U;M.k=k;
const c=await api('POST','/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records',{data:[{field:'first_name',value:v('QA')},{field:'last_name',value:v('E1 Evidence')},{field:'email',value:v(NEW)}]});M.contact=c.j?.data?.id;save();if(!M.contact)return {contact:E(c)};
const b=await api('POST','/modules/'+T+'/blueprints',{definition:{name:'QA AO E1 evidence '+U,description:'QA - safe to delete',moduleKey:'desk_tickets',targetField:'status',departmentId:DA,entryCriteria:{op:'contains',field:'subject',value:k},
 states:[{id:'Open',name:'Open',position:{x:0,y:0},slaClock:'calendar'},{id:'Closed',name:'Closed',position:{x:300,y:0},slaClock:'calendar',isTerminal:true}],transitions:[{id:'close',name:'Close',fromStateId:'Open',toStateId:'Closed',before:{allowOwner:true},during:{},after:{actions:[]}}]},isActive:true});
if(b.j?.data?.id){pbm.bp.push(b.j.data.id);pbSave();}else return {bp:E(b)};
const mk=async s=>{const r=await api('POST','/modules/'+T+'/records',{data:fields({subject:s,description:'QA E2E-1 evidence',department:DA,status:'Open',priority:'medium',owner:A2,contact_id:M.contact,email:NEW,channel:'web'})});const id=r.j?.data?.id;pbm.tickets.push(id);pbSave();return id;};
const uuid=()=>'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g,()=>(Math.random()*16|0).toString(16));
M.t1=await mk('QA AO E1 evidence A normal close, Happiness off');save();await sleep(3000);M.c1=(await api('POST','/desk/tickets/'+M.t1+'/close',{})).s;await sleep(20000);
const hs=(await api('GET','/desk/happiness/settings')).j.data;fs.writeFileSync('../e1-ev-happiness-orig.json',JSON.stringify(hs,null,1));
const ro=['expiry_days_min','expiry_days_max','question_max_length','public_page_configured','supervisors_max','closed_email_subject_max','closed_email_body_max','resend_after_hours_max','option_icons','option_label_max','option_text_max','option_image_max_bytes'];
const strip=o=>{const x={...o};for(const q of ro)delete x[q];return x;};
M.hOn=(await api('PUT','/desk/happiness/settings',strip({...hs,is_enabled:true,department_scope_enabled:true,department_ids:[DA]}))).s;save();
M.t2=await mk('QA AO E1 evidence B normal close, Happiness on');M.t3=await mk('QA AO '+k+' evidence C blueprint close, Happiness on');save();await sleep(8000);
M.c2=(await api('POST','/desk/tickets/'+M.t2+'/close',{})).s;M.c3=(await api('POST','/desk/tickets/'+M.t3+'/blueprint-transitions/close',{run_id:uuid(),expected_state_id:'Open',fields:{}})).s;await sleep(30000);
const cur=(await api('GET','/desk/happiness/settings')).j.data;const back=strip(hs);for(const q of ['row_version','version'])if(q in cur)back[q]=cur[q];M.hOff=(await api('PUT','/desk/happiness/settings',back)).s;
const n=(await api('GET','/desk/happiness/settings')).j.data;M.hDiff=Object.keys(hs).filter(q=>!['updated_at','row_version','version','updated_by'].includes(q)&&JSON.stringify(hs[q])!==JSON.stringify(n[q]));
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' E2E-1 evidence: Happiness ON Dept A for ~1 min, restored (diff '+M.hDiff.join(',')+'); contact + 3 tickets + bp kept for screenshots.\n');
for(const q of ['t1','t2','t3']){const o=await rec(M[q]);const f=await feed(M[q]);M[q+'info']={num:o.ticket_number,status:o.status,ev:f.reverse().map(e=>e.action).filter(a=>!/department_changed|created/.test(a))};}
save();return M;
