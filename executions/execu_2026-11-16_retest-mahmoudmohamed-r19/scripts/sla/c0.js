eval(fs.readFileSync('sla/lib.js','utf8'));
const id=CFG.a33.x1.id;const g=(await api('GET','/modules/'+T+'/records/'+id)).j?.data;log(JSON.stringify((g?.data||[]).map(z=>z.field+'='+JSON.stringify(z.value).slice(0,80))));
for(const p of ['/modules/'+T+'/fields','/modules/'+T+'/schema']){const r=await api('GET',p);log(p,r.s,(r.t.match(/"(api_name|key|name)":"[^"]*due[^"]*"/gi)||[]).join(' '));}
