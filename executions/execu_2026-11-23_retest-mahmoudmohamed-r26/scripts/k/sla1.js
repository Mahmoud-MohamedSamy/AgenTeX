const X=JSON.parse(fs.readFileSync(RUN+'/out/3136.json','utf8'));const o={at:new Date().toISOString().slice(11,19)};
for(const [k,id] of Object.entries(X.t)){const d=(await api('GET','/desk/tickets/'+id+'/sla')).j?.data;const t=(await api('GET','/desk/tickets/'+id)).j?.data;o[k]='#'+t?.ticket_number+' '+t?.status+' sla='+d?.state+' '+(d?.policy?.name||'-')+' note='+d?.note;}
const h=(await api('GET','/desk/tickets/'+X.t.C3+'/history')).j?.data;o.histC3=arr(h).map(x=>x.action).join(',');
return o;
