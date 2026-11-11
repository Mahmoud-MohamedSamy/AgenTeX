const b=JSON.parse(fs.readFileSync(RUN+'/baseline/global-sets.json','utf8')); const now=arr((await api('GET','/global-sets')).j.data);
const bm=Object.fromEntries(arr(b.data).map(s=>[s.id,s.name])); const nm=Object.fromEntries(now.map(s=>[s.id,s.name]));
const out={setsAdded:Object.keys(nm).filter(k=>!bm[k]).map(k=>nm[k]), setsRemoved:Object.keys(bm).filter(k=>!nm[k]).map(k=>bm[k])};
for (const [k,id] of [['leads',L],['contacts',I.C]]) { const bf=JSON.parse(fs.readFileSync(RUN+'/baseline/fields-'+k+'.json','utf8')); const f=arr((await api('GET','/modules/'+id+'/fields')).j.data); const bi=new Set(bf.map(x=>x.id)); const ni=new Set(f.map(x=>x.id)); out[k+'Added']=f.filter(x=>!bi.has(x.id)).map(x=>x.fieldName); out[k+'Removed']=bf.filter(x=>!ni.has(x.id)).map(x=>x.n); out[k+'Changed']=f.filter(x=>{const o=bf.find(y=>y.id===x.id); return o&&o.rv!==x.rowVersion;}).map(x=>x.fieldName); }
const lay=(await api('GET','/modules/'+L+'/layouts/'+I.LAY)).j.data; out.layoutRv=lay.rowVersion;
fs.writeFileSync(RUN+'/after/diff.json',JSON.stringify(out,null,1)); return out;
