const T='88e8ea44-1658-4df3-9930-d0902b91073d';
const r = await api('POST','/modules/'+T+'/records', {data:[{field:'subject',value:{kind:'string',value:'QA RT15 2205 probe'}}]}); log(r.s, r.t.slice(0,600));
