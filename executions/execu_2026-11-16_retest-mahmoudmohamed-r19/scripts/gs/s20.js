const r=await api('GET','/modules/'+L+'/views'); const vs=arr(r.j.data); log(r.s, vs.length, Object.keys(r.j.data||{}).join(','));
const v=(await api('GET','/modules/'+L+'/views/'+I.V2)).j.data; log('mine',JSON.stringify(v).slice(0,900));
const any=vs.find(x=>x.settings&&x.settings.columns&&x.settings.columns.length); if(any) log('other',JSON.stringify(any.settings.columns).slice(0,500));
