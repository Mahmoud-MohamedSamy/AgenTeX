const l=await api('GET','/reporting/reports'); return {s:l.s, t:l.t.slice(0,1500)};
