let g=await gs(I.S17); const r=await api('PUT','/global-sets/'+I.S17,{name:g.name,description:g.description,colors_enabled:false,values:g.values.map(v=>v.value==='Silver'?{...v,label:'Silver Star'}:v),row_version:g.row_version});
await sleep(3000); const q=await api('POST','/reporting/reports/'+I.REPB+'/query',{}); const s=JSON.stringify(q.j&&q.j.data);
return {rename:SR(r), reportValues:s.match(/"(Gold|Silver|Bronze|Gold Star|Silver Star)"/g), sample:s.slice(0,600), rep:I.REPB, view:I.V67};
