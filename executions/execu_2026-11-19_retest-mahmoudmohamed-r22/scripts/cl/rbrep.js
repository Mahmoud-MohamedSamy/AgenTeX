const L=JSON.parse(fs.readFileSync('../out/rb-reporting.json','utf8')).filter(x=>/QA RT(1[89]|2[0-3])/.test(x.record_label));const o={};const ids=L.map(x=>x.id);
for(const [p,b] of [['/audit/recycle-bin/run-jobs?app_key=reporting',{action:'purge',ids}],['/audit/recycle-bin/delete',{ids}],['/audit/recycle-bin/run-jobs?app_key=reporting',{action:'purge',ids,app_key:'reporting'}]]){const r=await api('POST',p,b);o[p+' '+Object.keys(b).join(',')]=r.s+' '+String(r.t).slice(0,200);}
return o;
