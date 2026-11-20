const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const fA=JSON.parse(fs.readFileSync('../out/wfA.json','utf8')),fB=JSON.parse(fs.readFileSync('../out/wfB.json','utf8'));
const BASE='https://staging-crm.taviportal.com/api/v1/web-forms/public/';const O='http://127.0.0.1:5500';
const pub=async(k,p,b,tok)=>{const t0=Date.now();const r=await fetch(BASE+k+p,{method:'POST',headers:{'content-type':'application/json',origin:O,...(tok?{'X-Web-Form-Session':tok}:{})},body:JSON.stringify(b)});const t=await r.text();let j;try{j=JSON.parse(t)}catch{};return {s:r.status,j,t,ms:Date.now()-t0};};
const count=async()=>{const r=await api('GET','/modules/'+L+'/records?page_size=1');return r.j?.meta?.total??r.j?.meta?.total_count??JSON.stringify(r.j?.meta).slice(0,80);};
const send=async(f,values)=>{const k=f.embed_key;const s=await pub(k,'/session',{});const tok=s.j?.data?.session_token;if(!tok)return 'no session '+s.s;const r=await pub(k,'/submissions',{submission_id:crypto.randomUUID(),values,file_ids:[],captcha_token:null,page_origin:O,tracking:{page_url:O+'/x.html'},elapsed_ms:6000,visitor_id:'qa-rt22-2822',honeypot:''},tok);
 return r.s+' '+r.ms+'ms '+(r.j?.error?JSON.stringify({code:r.j.error.code,d:(r.j.error.details||[]).map(d=>(d.path||d.field)+':'+d.type+':'+d.message)}):JSON.stringify(r.j?.data||r.t).slice(0,120));};
const base={first_name:'QA RT22 be',number_2:'',decimal:'',date:'',date_time:'',pick_list_2:'',multi_select:''};
const cases=JSON.parse(process.env.CASES);const out={before:await count()};
for(const [n,form,vals] of cases){out[n]=await send(form==='B'?fB:fA,form==='B'?vals:{...base,...vals});}
out.after=await count();return out;
