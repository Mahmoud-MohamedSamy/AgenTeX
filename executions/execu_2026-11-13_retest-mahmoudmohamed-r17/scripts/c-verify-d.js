const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const o={};
o.depts=arr((await api('GET','/desk/departments')).j.data).filter(d=>/QA RT17/.test(d.name)).length;
o.teams=JSON.stringify((await api('GET','/desk/teams')).j).match(/QA RT17/g)?.length||0;
o.views=((await api('GET','/modules/'+T+'/views?kind=list')).j.data.views||[]).filter(v=>/QA RT17/.test(v.name)).length;
o.layouts=arr((await api('GET','/modules/'+T+'/layouts')).j.data).filter(l=>/QA RT17/.test(l.name)).length;
let live=0; for(const id of [...I.T23.slice(0,10),I.TK94,I.A35.ticket]) if((await api('GET','/modules/'+T+'/records/'+id)).s===200) live++; o.ticketsLiveSample=live;
return o;
