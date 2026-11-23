const M='88e8ea44-1658-4df3-9930-d0902b91073d';
const r2 = await api('GET','/modules/'+M+'/records?limit=1'); log(Object.keys(r2.j.data[0]), JSON.stringify(r2.j.data[0]).slice(0,900));
