const all=arr((await api('GET','/workflow/rules?take=500')).j?.data);const ids=['53c7ed55-e571-4e6d-aacd-11e24cefee4d','48bc6c21-276c-4cce-a3dc-aedfead97792','895f86a1-013e-4d38-931a-bb3eb30b3858','53db4939-944e-4e9c-900d-9e1815653516'];
const ex=arr((await api('GET','/workflow/executions?take=200')).j?.data);
return {rules:ids.map(i=>{const r=all.find(x=>x.id===i);return r?r.name+' active='+r.isActive:'NOT FOUND '+i}), execCount:ex.length, withName:ex.filter(e=>e.ruleName||e.originName).length, sampleKeys:Object.keys(ex[0]||{}).join(','), originName:ex.slice(0,3).map(e=>e.originName)};
