const R={};
for(const u of ['/notifications/preferences/me','/desk/me/preferences','/notifications?limit=5&apps=desk']){const x=await api('GET',u);R[u]=x.s+' '+MASK(x.t).slice(0,2500);}
return R;
