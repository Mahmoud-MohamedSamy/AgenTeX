module.exports=async()=>{const m=s=>String(s).replace(/([A-Za-z0-9._%+-]{2})[A-Za-z0-9._%+-]*@/g,'$1***@');const r=await api('GET','/desk/channels/sending-overview');const d=r.j.data;
 const a=await api('GET','/desk/channels/addresses');return {receiving:m(JSON.stringify(d.receiving,null,0)).slice(0,1500),addresses:m(JSON.stringify(a.j.data)).slice(0,1500)};};
