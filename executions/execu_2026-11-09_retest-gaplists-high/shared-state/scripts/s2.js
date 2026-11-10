const r=await api('GET','/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records?pageSize=1');const x=arr(r.j.data)[0];
const d=x.data;const o={};for(const k of Object.keys(d)){const f=d[k];o[k]=f&&typeof f==='object'?(f.kind+':'+String(f.value===undefined?'':JSON.stringify(f.value)).slice(0,40)):f;}
const f=await api('GET','/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/fields');const fl=arr(f.j&&f.j.data!==undefined?f.j.data:f.j);
return {s:r.s,top:Object.keys(x),data:o,fieldsS:f.s,req:fl.filter(z=>z.required||z.isRequired||z.is_required).map(z=>(z.apiName||z.api_name||z.key)+'/'+(z.type||z.dataType)),owner:fl.filter(z=>/owner/i.test(z.apiName||z.api_name||z.key||'')).map(z=>(z.apiName||z.api_name||z.key)+'/'+(z.type||z.dataType))};
