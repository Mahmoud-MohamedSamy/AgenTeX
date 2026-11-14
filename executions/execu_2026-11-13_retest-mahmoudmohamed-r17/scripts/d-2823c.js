const T='88e8ea44-1658-4df3-9930-d0902b91073d'; const r=await api('GET','/modules/'+T+'/views?kind=list'); const a=(r.j.data.views||[]);
const mine=a.find(v=>v.id===I.V23); const other=a.find(v=>/My Open Tickets|Open/.test(v.name)&&v.id!==I.V23);
return {n:a.length, names:a.map(v=>v.name).slice(0,30), mine:String(JSON.stringify(mine)).slice(0,700), other:String(JSON.stringify(other)).slice(0,900), raw:r.s+' '+r.t.slice(0,200)};
