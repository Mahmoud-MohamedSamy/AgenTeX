const T=JSON.parse(fs.readFileSync('../out/2807.json','utf8'));const L=T.L;const ids=T.ids.slice(20);const o={};
const st=JSON.parse(fs.readFileSync('C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad/r18-o.json','utf8'));const tk=st.cookies.find(c=>c.name==='aw_staging_access_token').value;
const ac=new AbortController();const t0=Date.now();
const p=fetch('https://staging-crm.taviportal.com/api/v1/modules/'+L+'/records/mass-update',{method:'POST',signal:ac.signal,headers:{'content-type':'application/json','x-app-key':'crm','x-tenant-id':'a7a7a7a7-0000-0000-0000-000000000004',authorization:'Bearer '+tk},body:JSON.stringify({record_ids:ids,data:[{field:'lead_source',value:{kind:'string',value:'Referral'}}]})}).then(r=>'completed '+r.status).catch(e=>'aborted after '+(Date.now()-t0)+'ms');
await sleep(1000);ac.abort();o.request=await p;
const count=async()=>{let n=0;for(let i=0;i<ids.length;i+=30){const rs=await Promise.all(ids.slice(i,i+30).map(id=>api('GET','/modules/'+L+'/records/'+id)));for(const r of rs){const v=(r.j?.data?.data||[]).find(x=>x.field==='lead_source')?.value?.value;if(v==='Referral')n++;}}return n;};
await sleep(44000);o.referralAt45s=await count()+'/'+ids.length;await sleep(60000);o.referralAt2min=await count()+'/'+ids.length;
const jobs=await api('GET','/jobs?limit=5');o.jobs=jobs.s+' '+String(jobs.t).slice(0,200);return o;
