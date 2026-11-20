const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
const LED=m=>fs.appendFileSync('../ledger.md',`- ${new Date().toISOString().slice(0,19)} ${m} (lane VR)\n`);
const I=JSON.parse(fs.readFileSync('vr/ids.json','utf8'));



let r; const g=(await api('GET','/modules/'+T+'/layouts/'+I.layout)).j.data; o.layStatus=g.status;
const lb={...g}; delete lb.id; delete lb.displayInHelpCenter; lb.status='disabled'; r=await api('PUT','/modules/'+T+'/layouts/'+I.layout,lb); o.layOff=r.s+' '+(r.s>=300?r.t.slice(0,300):''); o.layNow=(await api('GET','/modules/'+T+'/layouts/'+I.layout)).j.data.status;
LED('layout '+I.layout+' status '+o.layStatus+' → '+o.layNow);
return o;
