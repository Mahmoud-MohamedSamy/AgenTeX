for(const p of ['/desk/ticket-access/settings','/desk/data-sharing']){const x=await api('GET',p);log(p,x.s,x.t.slice(0,1500));}
