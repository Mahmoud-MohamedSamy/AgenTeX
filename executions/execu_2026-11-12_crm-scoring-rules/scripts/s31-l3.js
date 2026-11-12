const L=await modId('leads');
const tries=['format=csv&scope=page&page=1&pageSize=50&q=QA%20SR1112&lang=en','format=csv&scope=filtered&q=QA%20SR1112&lang=en','format=xlsx&scope=page&page=1&pageSize=20&lang=en'];
let fin=null; for(const q of tries){const ex=await api('GET','/modules/'+L+'/records/export?'+q); log('export',q,ex.s,(ex.t||'').slice(0,160).replace(/\n/g,' | ')); if(ex.s===200&&!fin) fin=[q,ex];}
if(fin){const hdr=fin[1].t.split(/\r?\n/)[0]; const hasScore=/Score/.test(hdr); RES('F5',hasScore?'pass':'fail','export ('+fin[0]+') 200; header has Score: '+hasScore+'; header: '+hdr.slice(0,200)+'. Export of all leads (scope=all) timed out 504.');}
else RES('F5','blocked','export by API: scope=all 504 (gateway timeout); page/filtered variants did not return 200 — needs the UI export');
// L3
const r=arr((await api('GET','/scoring-rules?module_id='+L)).j.data).find(x=>x.name===P+'L3'); log('L3 rule',!!r);
const ids=[]; for(let i=0;i<500;i+=10){const got=await Promise.all(Array.from({length:10},(_,j)=>newRec(L,{first_name:P+'L3 '+(i+j),lead_source:'chat'}))); got.forEach(x=>x&&ids.push(x));}
const t0=Date.now(); const mu=await api('POST','/modules/'+L+'/records/mass-update',{record_ids:ids,data:[{field:'lead_source',value:{kind:'string',value:'web'}}]}); const dt=Date.now()-t0;
log('mass',SR(mu).slice(0,300)); await sleep(8000); let ok=0,bad=[]; for(let i=0;i<ids.length;i+=10){const ss=await Promise.all(ids.slice(i,i+10).map(id=>recScore(L,id))); ss.forEach((s,k)=>{if(s===10)ok++; else if(bad.length<5)bad.push(ids[i+k].slice(0,8)+'='+s);});}
RES('L3',(mu.s<300&&ok===ids.length&&ids.length===500)?'pass':'fail','created '+ids.length+' chat leads; mass update to web '+SR(mu).slice(0,140)+' in '+dt+' ms; scored 10: '+ok+'/'+ids.length+(bad.length?' e.g. '+bad.join(','):''));
