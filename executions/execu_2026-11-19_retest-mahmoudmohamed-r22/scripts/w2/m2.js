const o={};
for(const [n,id] of [['leads','841043e1-c078-41f9-8d6e-dfd61bee45c3'],['accounts','b2398920-2914-4836-be53-81bd960effea'],['deals','f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430']]){
const a=arr((await api('GET',`/modules/${id}/fields?take=500`)).j?.data);
o[n]=a.filter(x=>/pick|select|list|enum/i.test(x.datatypeKey)).map(x=>`${x.apiName}(${x.labels?.en})[${x.datatypeKey}] `+JSON.stringify(x.datatypeOptions).slice(0,260));}
return o;
