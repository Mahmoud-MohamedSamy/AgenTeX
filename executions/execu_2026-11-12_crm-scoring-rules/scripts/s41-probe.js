const o={}; for(const p of ['/scoring-rules','/modules','/reporting/semantic-layer/datasets','/reporting/reports?per_page=1']){const r=await api('GET',p); o[p]=r.s;} return o;
