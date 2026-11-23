const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';const OUT='D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-21_retest-mahmoudmohamed-r24/out/';
const f=JSON.parse(fs.readFileSync(OUT+'wf24A.json','utf8'));const K=f.embed_key;
const BASE='https://staging-crm.taviportal.com/api/v1/web-forms/public/';const O='http://127.0.0.1:5500';
const pub=async(p,b,tok)=>{const r=await fetch(BASE+K+p,{method:'POST',headers:{'content-type':'application/json',origin:O,...(tok?{'X-Web-Form-Session':tok}:{})},body:JSON.stringify(b)});const t=await r.text();let j;try{j=JSON.parse(t)}catch{};return {s:r.status,j,t};};
const sum=r=>r.s+' '+(r.j?.error?JSON.stringify({code:r.j.error.code,d:(r.j.error.details||[]).map(d=>(d.path||d.field||'')+':'+(d.type||d.code)+':'+d.message)}):JSON.stringify(r.j?.data||r.t).slice(0,160));
const sess=async()=>(await pub('/session',{})).j?.data?.session_token;
const mint=async(tok,sid,name,type,size)=>pub('/uploads',{submission_id:sid,file_name:name,content_type:type,size_bytes:size,kind:'attachment',page_origin:O},tok);
const put=async(m,buf)=>{const r=await fetch(m.upload_url,{method:'PUT',body:buf,headers:{'content-type':m.content_type}});return r.status;};
const submit=async(tok,sid,values,file_ids=[])=>pub('/submissions',{submission_id:sid,values,file_ids,captcha_token:null,page_origin:O,tracking:{page_url:O+'/fA24.html'},elapsed_ms:6000,visitor_id:'qa-rt24-2822',honeypot:''},tok);
const o={};const U=()=>globalThis.crypto.randomUUID();
let tok=await sess();o.session=!!tok;
o.c1_num55=sum(await submit(tok,U(),{first_name:'QA RT24 c1',number_2:5.5}));
o.c2_str55=sum(await submit(tok,U(),{first_name:'QA RT24 c2',number_2:'5.5'}));
o.c3_str40=sum(await submit(tok,U(),{first_name:'QA RT24 c3',number_2:'4.0'}));
o.c4_hidden=sum(await submit(tok,U(),{first_name:'QA RT24 c4',number_2:'7',decimal:'9'}));
o.c5_valid=sum(await submit(tok,U(),{first_name:'QA RT24 c5',number_2:'42'}));
// files
let sid=U();let m=await mint(tok,sid,'x.html','text/html',100);o.f1_html=sum(m);
m=await mint(tok,sid,'big.png','image/png',25*1024*1024);o.f2_25mb=sum(m);
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==','base64');
sid=U();const ids=[];for(let i=0;i<6;i++){const mm=await mint(tok,sid,'qa'+i+'.png','image/png',png.length);if(mm.j?.data?.file_id){ids.push(mm.j.data.file_id);await put(mm.j.data,png);}else{o['f3_mint'+i]=sum(mm);break;}}
o.f3_minted=ids.length;o.f3_six=sum(await submit(tok,sid,{first_name:'QA RT24 f3',number_2:'3'},ids));
sid=U();const m1=await mint(tok,sid,'qa-one.png','image/png',png.length);o.f4_put=m1.j?.data?await put(m1.j.data,png):sum(m1);o.f4_one=sum(await submit(tok,sid,{first_name:'QA RT24 f4',number_2:'5'},m1.j?.data?[m1.j.data.file_id]:[]));
await sleep(5000);
const r=await api('GET','/modules/'+L+'/records?page_size=50&search='+encodeURIComponent('QA RT24'));const recs=arr(r.j?.data||r.j);
const val=x=>!x?undefined:x.kind==='array'?(x.items||[]).map(val):x.value;
o.records=recs.map(x=>{const d=Object.fromEntries((x.data||[]).map(f=>[f.field,val(f.value)]));return {id:x.id,first_name:d.first_name,number_2:d.number_2,decimal:d.decimal}}).filter(x=>/QA RT24/.test(x.first_name||''));
if(!o.records.length)o.recRaw=r.s+' '+r.t.slice(0,300);
fs.writeFileSync(OUT+'2822-be.json',JSON.stringify(o,null,1));log(o);
