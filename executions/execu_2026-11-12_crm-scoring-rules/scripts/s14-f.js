const L=await modId('leads'); const out={};
const ly=await api('GET','/modules/'+L+'/layouts'); const lays=arr(ly.j&&ly.j.data); out.layouts=lays.map(l=>l.name+':'+(JSON.stringify(l).includes('"score"')||JSON.stringify(l).includes(I.scoreFieldId||'8dc7af5d')?'HAS score':'no score'));
const f=(await fields(L)).find(x=>x.fieldName==='score'); out.scoreField={layouts:f.layouts, caps:f.capabilities, labels:f.labels};
// list/filter via records query
const q=await api('POST','/modules/'+L+'/records/query',{filter:{field:'score',operator:'gte',value:{kind:'number',value:30}},sort:[{field:'score',direction:'desc'}],per_page:5});
out.query=q.s+' '+(q.s<300?arr(q.j.data).length+' rows':E(q).slice(0,160));
const v=await api('GET','/modules/'+L+'/views'); out.views=v.s;
return out;
