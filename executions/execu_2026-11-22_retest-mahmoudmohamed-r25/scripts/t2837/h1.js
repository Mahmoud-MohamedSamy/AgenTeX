const r=await api('GET','/desk/channels/inbound-health');return {at:new Date().toISOString(),s:r.s,body:r.t.slice(0,1200)};
