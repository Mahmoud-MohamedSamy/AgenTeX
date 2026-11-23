const OUT='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-21_retest-mahmoudmohamed-r24/out/';
const F={crmEmpty:['crm',JSON.parse(fs.readFileSync(OUT+'wf3138crm.json','utf8')).embed_key],deskEmpty:['desk',JSON.parse(fs.readFileSync(OUT+'wf3138desk.json','utf8')).embed_key],crmListed:['crm',JSON.parse(fs.readFileSync(OUT+'wf24A.json','utf8')).embed_key]};
const o={};
for(const [n,[app,k]] of Object.entries(F)){for(const O of ['http://127.0.0.1:5500','https://example.com','http://localhost:5500']){try{
 const B='https://staging-'+app+'.taviportal.com/api/v1/web-forms/public/'+k;
 const s=await fetch(B+'/session',{method:'POST',headers:{'content-type':'application/json',origin:O},body:'{}'});const st=await s.text();let tok;try{tok=JSON.parse(st).data?.session_token}catch{}
 const cfg=await fetch(B+'?origin='+encodeURIComponent(O),{headers:{origin:O}});
 let sub='-';if(tok){const r=await fetch(B+'/submissions',{method:'POST',headers:{'content-type':'application/json',origin:O,'X-Web-Form-Session':tok},body:JSON.stringify({submission_id:globalThis.crypto.randomUUID(),values:{},file_ids:[],captcha_token:null,page_origin:O,tracking:{page_url:O+'/x.html'},elapsed_ms:6000,visitor_id:'qa-rt24-3138',honeypot:''})});const t=await r.text();let j;try{j=JSON.parse(t)}catch{};sub=r.status+' '+(j?.error?j.error.code+' '+(j.error.details||[]).map(d=>d.message).join('; '):t.slice(0,80));}
  o[n+' '+O]={session:s.status+(s.status>=300?' '+st.slice(0,120):''),config:cfg.status,acao:s.headers.get('access-control-allow-origin'),emptySubmit:sub};}catch(e){o[n+' '+O]='ERR '+e.message+' '+(e.cause?.code||'')}}}
fs.writeFileSync(OUT+'3138-api.json',JSON.stringify(o,null,1));log(o);
