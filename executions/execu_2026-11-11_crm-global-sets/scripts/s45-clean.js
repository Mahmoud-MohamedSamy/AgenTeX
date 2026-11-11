const o={}; const d=async p=>(await api('DELETE',p)).s;
o.recs=[]; for(const id of I.R2) o.recs.push(await d('/modules/'+L+'/records/'+id));
o.field=await d('/modules/'+L+'/fields/'+I.fR2);
o.sets=[]; for(const s of arr((await api('GET','/global-sets')).j.data).filter(s=>/^QA GS1111/.test(s.name))) o.sets.push(s.name+':'+await d('/global-sets/'+s.id));
const l=(await api('GET','/modules/'+L+'/layouts/'+I.LAY)).j.data; o.layoutRv=l.rowVersion; o.layoutHasField=JSON.stringify(l.views).includes('qa_gs1111_r2');
const now=arr((await api('GET','/global-sets')).j.data).length; o.setsNow=now;
LED('CLEANUP round 2 '+JSON.stringify(o)); return o;
