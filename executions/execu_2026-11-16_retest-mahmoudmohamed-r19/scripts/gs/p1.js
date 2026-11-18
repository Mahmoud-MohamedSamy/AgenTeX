const r=await api('GET','/global-sets?limit=200'); const L=arr(r.j&&r.j.data||r.j);
log('list',r.s,'count',L.length, 'meta', JSON.stringify(r.j&&r.j.meta||r.j&&r.j.pagination||{}));
if(L[0]) log('row keys', Object.keys(L[0]).join(','));
log('names', L.map(x=>x.name).join(' | ').slice(0,1500));
const one=L.find(x=>/Source|Industry|Countr/i.test(x.name)); log('builtin?', one?one.name:'none');
const d=(await api('GET','/global-sets/'+L[0].id)).j; log('detail keys', Object.keys(d.data||d).join(','));
const v=(d.data||d).values||[]; if(v[0]) log('value keys', Object.keys(v[0]).join(','));
const u=await api('GET','/global-sets/'+L[0].id+'/used-in'); log('usedin',u.s,u.t.slice(0,800));
for (const p of ['/global-sets/'+L[0].id+'/replaced-values','/global-sets/'+L[0].id+'/actions/replaced_values','/global-sets/'+L[0].id+'/replace-history','/global-sets/'+L[0].id+'/history','/global-sets/limits','/global-sets/'+L[0].id+'/values/used-in','/global-sets/predefined','/global-sets/'+L[0].id+'/values/delete','/countries','/settings/countries','/global-sets/'+L[0].id+'/replacements']) { const x=await api('GET',p); log('GET',p.replace(L[0].id,'{id}'),x.s,x.t.slice(0,200)); }
