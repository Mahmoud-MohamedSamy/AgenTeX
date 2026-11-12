const L=await modId('leads');
const mk=async n=>{const r=await api('POST','/modules/'+L+'/records',recBody({first_name:P+'L3 '+n,lead_source:'chat'}));return r.j&&r.j.data&&r.j.data.id;};
const ids=[]; for(let i=0;i<500;i+=10){const got=await Promise.all(Array.from({length:10},(_,j)=>mk(i+j))); got.forEach(x=>x&&ids.push(x));}
I.recs=(I.recs||[]).concat(ids.map(id=>[L,id])); SAVE();
const t0=Date.now(); const mu=await api('POST','/modules/'+L+'/records/mass-update',{record_ids:ids,data:[{field:'lead_source',value:{kind:'string',value:'web'}}]}); const dt=Date.now()-t0;
log('mass',SR(mu).slice(0,300)); await sleep(8000); let ok=0,bad=[]; for(let i=0;i<ids.length;i+=10){const ss=await Promise.all(ids.slice(i,i+10).map(id=>recScore(L,id))); ss.forEach((s,k)=>{if(s===10)ok++; else if(bad.length<5)bad.push(ids[i+k].slice(0,8)+'='+s);});}
RES('L3',(mu.s<300&&ok===ids.length&&ids.length===500)?'pass':'fail','created '+ids.length+' chat leads; mass update to web '+SR(mu).slice(0,140)+' in '+dt+' ms; scored 10: '+ok+'/'+ids.length+(bad.length?' e.g. '+bad.join(','):''));
