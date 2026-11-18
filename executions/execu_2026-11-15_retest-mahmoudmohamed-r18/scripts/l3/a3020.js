const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const I=JSON.parse(fs.readFileSync('l3/ids.json','utf8')); const o={};
const ms=arr((await api('GET','/modules')).j.data); const C=ms.find(m=>m.moduleKey==='desk_contacts')||ms.find(m=>/contact/i.test(m.moduleKey)); o.other=C&&(C.moduleKey+' '+C.id); o.keys=ms.map(m=>m.moduleKey).join(',');
const g1=await api('GET','/modules/'+C.id+'/validation-rules/'+I.VR12); o.getWrong=g1.s+' '+g1.t.slice(0,150);
const d=await api('DELETE','/modules/'+C.id+'/validation-rules/'+I.VR12); o.delWrong=d.s+' '+d.t.slice(0,200);
const g2=await api('GET','/modules/'+T+'/validation-rules/'+I.VR12); o.getRight=g2.s+' status='+(g2.j&&g2.j.data&&g2.j.data.status);
return o;
