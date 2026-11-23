const fs=require('fs');const M=s=>String(s).replace(/[\w.+-]+@[\w.-]+/g,'<email>');
module.exports=async(page,z)=>{const st=JSON.parse(fs.readFileSync(__dirname+'/state.json'));const o={};
for(const t of st.t){const all=await z('GET','/api/v1/tickets/'+t.id+'/threads?limit=20');
for(const th of (all.j?.data||[]).filter(x=>x.direction==='out')){const oc=await z('GET','/api/v1/tickets/'+t.id+'/threads/'+th.id+'/originalContent');
const txt=oc.j?JSON.stringify(oc.j):oc.t;o[t.n+'/'+th.id]={keys:oc.j?Object.keys(oc.j).join(','):'', subj:M(oc.j?.subject), head:M(txt).slice(0,500)};}}
return o;};
