// Step 5, run as A2 (Mahmoud Samy): blueprint "Ask customer" with the mandatory public reply to the customer (+qae1).
const M=JSON.parse(fs.readFileSync('../e1.json','utf8'));const me=(await api('GET','/iam/me')).j?.data?.display_name;
const uuid=()=>'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g,()=>(Math.random()*16|0).toString(16));
const to='mahmoud.mmohamedsamy+qae1@gmail.com';
const body='<p>Hello, this is Mahmoud Samy from support (QA E2E-1, ticket #'+(M.num||'')+').</p><p>Could you please reply to this ticket in the Help Center and tell us which documents you already sent?</p>';
const r=await api('POST','/desk/tickets/'+M.t+'/blueprint-transitions/ask',{run_id:uuid(),expected_state_id:'Open',fields:{},reply:{to:[to],cc:[],bcc:[],content:body,template_id:null,from_address_id:null}});
M.s5={at:new Date().toISOString(),res:r.s};fs.writeFileSync('../e1.json',JSON.stringify(M,null,1));
return {me,run:r.s+' '+(r.j?.error?.code||'')+' '+String(r.j?.error?.message||'').slice(0,200)};
