const r=await api('GET','/desk/views?module=tickets'); return {s:r.s,t:r.t.slice(0,1500)};
