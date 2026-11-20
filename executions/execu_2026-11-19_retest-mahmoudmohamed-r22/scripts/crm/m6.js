const T=JSON.parse(fs.readFileSync('../out/2807.json','utf8'));const L=T.L;const o={};const s=v=>({kind:'string',value:v});const J='4730a14a-13df-409e-b1e1-8e93b650b409';
const v=async id=>JSON.stringify((((await api('GET','/modules/'+L+'/records/'+id)).j?.data?.data)||[]).find(x=>x.field==='lead_source')?.value);
o.sampleUpdated=await v(T.ids[20]);o.sampleControl=await v(T.ids[0]);
const g=(await api('GET','/modules/'+L+'/mass-update-jobs/'+J)).j?.data;o.job1=g.status+' '+g.processed+'/'+g.requested+' updated '+g.updated;
const j2=await api('POST','/modules/'+L+'/records/mass-update-jobs',{record_ids:T.ids.slice(0,20),data:[{field:'lead_source',value:s('Web')}]});o.job2WhileJob1Runs=j2.s+' '+String(j2.t).slice(0,240);
return o;
