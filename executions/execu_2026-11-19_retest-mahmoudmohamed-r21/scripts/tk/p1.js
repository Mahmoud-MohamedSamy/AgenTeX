const TK='88e8ea44-1658-4df3-9930-d0902b91073d';
for (const p of ['/modules/'+TK+'/views','/desk/ticket-views','/desk/views','/views?module_id='+TK,'/modules/'+TK+'/views?include_system=true']){const v=await api('GET',p);log(p,v.s,v.t.slice(0,600));}
