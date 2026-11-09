eval(require('fs').readFileSync('lib.js','utf8'));
const o={};
for(const [n,id] of [['tickets',T],['contacts',CM]]){const r=await api('GET','/modules/'+id+'/fields');const L=arr(r.j.data&&(r.j.data.fields||r.j.data));o[n+'_keys']=Object.keys(L[0]||{}).join(',');o[n+'_first']=JSON.stringify(L[0]).slice(0,600);}
const w=await api('GET','/web-forms');o.webforms=JSON.stringify(w.j).slice(0,2500);
return o;
