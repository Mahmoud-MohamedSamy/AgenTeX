const o={};
for(const rec of ['ae90128e-8c50-4256-b38c-c86f8249185e','7c097be7-134d-4771-9f2d-e9fcfb440011','8923a0ed-1612-4635-b481-d2e6b5b4e720','c9e9eb3a-71db-4c89-8ef2-07f25276e402']){const e=arr((await api('GET','/workflow/executions?recordId='+rec)).j?.data);o[rec.slice(0,8)]=e.map(x=>({id:x.id.slice(0,8),rule:x.ruleId.slice(0,8),at:x.evaluatedAt,corr:x.correlationId.slice(0,8),originName:x.originName,det:x.details,d:x.dispatches.map(d=>JSON.stringify(d).slice(0,700))}));}
return o;
