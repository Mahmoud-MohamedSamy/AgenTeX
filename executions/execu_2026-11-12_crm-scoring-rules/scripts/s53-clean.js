const L=await modId('leads'); const o={rules:await delAllQA()};
o.undo=(await api('POST','/modules/'+L+'/import/'+I.imp_X1+'/undo')).s;
let d=0; for(const id of (I.x1ids||[])){const r=await api('DELETE','/modules/'+L+'/records/'+id); if(r.s<300)d++;} o.deleted=d;
o.left=arr((await api('GET','/modules/'+L+'/records?q='+encodeURIComponent('QA SR1112')+'&per_page=100')).j.data).filter(x=>JSON.stringify(x).includes('QA SR1112')).length;
let n=0; for(const m of arr((await api('GET','/modules')).j.data)) n+=arr((await api('GET','/scoring-rules?module_id='+m.id)).j.data).length; o.rulesLeft=n; return o;
