module.exports=async()=>{const r=await api('GET','/mail/signatures/me');return {s:r.s,t:r.t.slice(0,700)};};
