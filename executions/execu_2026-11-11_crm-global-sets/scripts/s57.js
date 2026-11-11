const l=await api('GET','/reporting/reports/library?page=1'); const m=await api('GET','/reporting/semantic-layer/datasets'); return {s:l.s, t:l.t.slice(0,1800), ds:m.s+' '+m.t.slice(0,800)};
