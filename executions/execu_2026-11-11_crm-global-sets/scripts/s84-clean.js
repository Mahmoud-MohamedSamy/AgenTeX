const o={}; const d=async p=>(await api('DELETE',p)).s;
o.recs=[]; for(const id of (I.MSR||[])) if(id) o.recs.push(await d('/modules/'+L+'/records/'+id));
if(I.MSA) o.recs.push(await d('/modules/'+L+'/records/'+I.MSA));
o.field=await d('/modules/'+L+'/fields/'+I.fMS); o.set=await d('/global-sets/'+I.MSS);
o.leftSets=arr((await api('GET','/global-sets')).j.data).map(s=>s.name); o.leftFields=arr((await api('GET','/modules/'+L+'/fields')).j.data).filter(f=>/qa_gs1111/.test(f.fieldName)).map(f=>f.fieldName);
LED('CLEANUP round 4 '+JSON.stringify(o)); return o;
