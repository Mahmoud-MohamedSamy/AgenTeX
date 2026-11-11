const T='88e8ea44-1658-4df3-9930-d0902b91073d', F='1107d7d2-a2a2-4511-a4f8-5f56b2a987d4';
let r=await api('PATCH','/modules/'+T+'/fields/'+F+'/labels',{labels:{en:'Phone'}}); log('patch1', r.s, r.t.slice(0,200));
if(r.s>=300){ r=await api('PATCH','/modules/'+T+'/fields/'+F+'/labels',{en:'Phone'}); log('patch2', r.s, r.t.slice(0,200)); }
const ph = arr((await api('GET','/modules/'+T+'/fields')).j.data).find(f=>f.fieldName==='phone'); log('now', JSON.stringify(ph.labels));
