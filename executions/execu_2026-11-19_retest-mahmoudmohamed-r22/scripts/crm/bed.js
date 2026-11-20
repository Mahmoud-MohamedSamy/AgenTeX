const did=fs.readFileSync('../out/wf-ids.txt','utf8').split(' ')[0];const g=(await api('GET','/web-forms/'+did)).j?.data;const k=g.embed_key;const O='http://127.0.0.1:5500';const BASE='https://staging-crm.taviportal.com/api/v1/web-forms/public/';
const keys=g.definition.fields.map(f=>f.key);const o={fields:keys.join(',')};
const send=async(vals)=>{const s=await (await fetch(BASE+k+'/session',{method:'POST',headers:{'content-type':'application/json',origin:O},body:'{}'})).json();const tok=s?.data?.session_token;const base={};keys.forEach(x=>base[x]='');
 const r=await fetch(BASE+k+'/submissions',{method:'POST',headers:{'content-type':'application/json',origin:O,'X-Web-Form-Session':tok},body:JSON.stringify({submission_id:crypto.randomUUID(),values:{...base,...vals},file_ids:[],captcha_token:null,page_origin:O,tracking:{page_url:O+'/d.html'},elapsed_ms:6000,visitor_id:'qa-rt22-2822d',honeypot:''})});const j=await r.json().catch(()=>({}));return r.status+' '+JSON.stringify((j.error?.details||[]).map(d=>(d.path||d.field)+':'+d.type)||j.data).slice(0,250);};
const sub=keys.find(x=>/subject/.test(x)),ln=keys.find(x=>/last/.test(x)),em=keys.find(x=>/email/.test(x)),cls=keys.find(x=>/classification/.test(x));
const ok={[sub]:'QA RT22 2822 desk',[ln]:'QA RT22',[em]:'qa.rt22.2822d@example.com'};
o.badEmail=await send({...ok,[em]:'not-an-email'});o.badOption=await send({...ok,[cls]:'nope'});o.unknown=await send({...ok,qa_unknown_field:'x'});o.spacesSubject=await send({...ok,[sub]:'    '});
return o;
