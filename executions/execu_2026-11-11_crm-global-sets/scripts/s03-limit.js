const start=arr((await api('GET','/global-sets')).j.data).length; const made=[]; let stop='';
for (let i=1; start+made.length<51; i++) { const r=await api('POST','/global-sets',{name:'QA GS1111 Lim '+i,values:[{label:'A'}]}); if(r.s<300){made.push(r.j.data.id);LED('set Lim '+i+' '+r.j.data.id);} else {stop=SR(r);break;} }
const total=arr((await api('GET','/global-sets')).j.data).length;
let del=0; for (const id of made){ const d=await api('DELETE','/global-sets/'+id); if(d.s<300){del++; LED('DELETED set Lim '+id);} }
RES('C15', stop?'Info':'Gap', 'started at '+start+' sets, created '+made.length+', total '+total+(stop?' then refused: '+stop:' — no limit hit at 51 (Zoho: 30 Enterprise / 50 Ultimate)')+'; deleted '+del+'/'+made.length);
return 'ok';
