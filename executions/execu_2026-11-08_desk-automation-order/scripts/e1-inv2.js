// E2E-1: user cannot sign in as +qaao, so move the customer to a fresh address (+qae1) and invite it.
eval(fs.readFileSync('lib-as.js','utf8'));const F='../e1.json';const M=JSON.parse(fs.readFileSync(F,'utf8'));const HC='e74f2abb-e28d-400e-908c-f2c54862e389';
const NEW='mahmoud.mmohamedsamy+qae1@gmail.com';const v=x=>({kind:'string',value:x});const R={};const mask=s=>String(s).replace(/mahmoud\.mmohamedsamy/g,'G');
const cp=await api('PATCH','/modules/43004ce2-577f-4eda-b00a-0750fe40c3d4/records/'+M.contact,{data:[{field:'email',value:v(NEW)},{field:'first_name',value:v('QA')},{field:'last_name',value:v('E1 Customer')}]});R.contact=cp.s+(cp.s>=300?' '+mask(E(cp)).slice(0,250):'');
const tp=await patch(M.t,{email:NEW});R.ticketEmail=mask(E(tp)).slice(0,200);
const iv=await api('POST','/help-centers/'+HC+'/invitations/contacts',{contact_ids:[M.contact]});R.invite=iv.s+' '+mask(JSON.stringify((iv.j?.data||[]).map(x=>({outcome:x.outcome,email:x.email})))).slice(0,300);
const r=await rec(M.t);R.ticket={email:mask(r.email),owner:nm(r.owner),status:r.status,priority:r.priority};M.newEmail='+qae1';fs.writeFileSync(F,JSON.stringify(M,null,1));
fs.appendFileSync('../ledger.md','- '+new Date().toISOString().slice(0,19)+' E2E-1: contact '+M.contact+' email -> +qae1 and portal invite (delete contact + portal user after).\n');return R;
