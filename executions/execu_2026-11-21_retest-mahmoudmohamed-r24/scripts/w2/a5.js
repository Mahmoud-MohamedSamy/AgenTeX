eval(fs.readFileSync('w2/lib.js','utf8'));const o={};
for(const [k,rid] of [['create','f7112914-17b5-4bd9-b7d9-84643e3aa3cf'],['rem','c840c74c-9724-4af3-9915-1121c645857e'],['mix','77a9ad56-76a3-410f-98c6-e0c49e65b54d'],['wrong','7fd6c912-6313-4d8f-8be9-b73315e1912e']]){
const r=await api('GET','/workflow/executions?ruleId='+rid);o[k]=arr(r.j?.data).filter(e=>e.ruleId===rid).map(e=>e.id+' '+e.recordId);}
return o;
