const out={};const EV='6fb19115-9356-40f0-b064-840d8f1fad93',TM='d120a6c2-2596-4254-968b-a1bcd3a000bf';
for(const [k,M] of [['ev',EV],['tm',TM]]){const f=arr((await api('GET','/modules/'+M+'/fields')).j);out[k+'keys']=Object.keys(f[0]||{}).join(',');out[k]=f.map(z=>(z.apiName||z.api_name||z.field_name||z.name)+':'+(z.dataType||z.data_type||z.type)+((z.isRequired||z.required||z.is_mandatory)?'*':'')).join(' ');}
return out;
