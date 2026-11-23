const TK='88e8ea44-1658-4df3-9930-d0902b91073d',OW='97be04b6-0a08-4883-aa51-e1650b11cab7';const M=JSON.parse(fs.readFileSync('../out/2799-made.json','utf8'));
const r=await api('PATCH','/modules/'+TK+'/records/'+M.t.CPRIV.id,{data:[{field:'owner',value:{kind:'string',value:OW}}]});return r.t.slice(0,800);
