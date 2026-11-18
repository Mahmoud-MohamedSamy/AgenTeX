const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const I=JSON.parse(fs.readFileSync('l3/ids.json','utf8'));
const c={}; const open=[]; for(const id of I.T28){ const d=(await api('GET','/modules/'+T+'/records/'+id)).j.data.data; const g=f=>((d.find(x=>x.field===f)||{}).value||{}).value; const s=g("priority"); c[s]=(c[s]||0)+1; if(s!=='Medium') open.push(g('ticket_number')); }
return {c, notClosed:open.slice(0,20)};
