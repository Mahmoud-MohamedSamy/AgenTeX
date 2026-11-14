const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const st=async id=>(JSON.stringify((await api('GET','/modules/'+T+'/records/'+id)).j.data).match(/"status","value":\{"kind":"[a-z]+","value":"([^"]*)"/)||[])[1];
const open=[]; for(const id of I.T23){ if((await st(id))==='Open') open.push(id); }
const out=[]; for(const id of open){ const r=await api('POST','/desk/tickets/'+id+'/close',{}); out.push(r.s+(r.s>=300?' '+r.t.slice(0,150):'')); }
const b={}; out.forEach(x=>{const k=x.slice(0,3); b[k]=(b[k]||0)+1;}); return {open:open.length, b, sample:out.find(x=>!x.startsWith('200'))};
