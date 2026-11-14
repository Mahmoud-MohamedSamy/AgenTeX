const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const st=async id=>(JSON.stringify((await api('GET','/modules/'+T+'/records/'+id)).j.data).match(/"status","value":\{"kind":"[a-z]+","value":"([^"]*)"/)||[])[1];
const open=[]; for(const id of I.T23){ if((await st(id))==='Open') open.push(id); if(open.length>=20) break; }
const par=await Promise.all(open.slice(0,10).map(id=>api('POST','/desk/tickets/'+id+'/close',{})));
const seq=[]; for(const id of open.slice(10,15)){ seq.push(await api('POST','/desk/tickets/'+id+'/close',{})); }
const after=[]; for(const id of open.slice(0,15)) after.push(await st(id));
const b={}; par.forEach(r=>b['par '+r.s]=(b['par '+r.s]||0)+1); seq.forEach(r=>b['seq '+r.s]=(b['seq '+r.s]||0)+1);
return {counts:b, sample500:(par.find(r=>r.s>=500)||{}).t, after:after.join(',')};
