const L=await X.lead('u1','QA RT r10 1948 lead',{}); return {id:L.j?.data?.id, s:L.s, tl:(await api('u1','GET',`/timeline/records/leads/${L.j?.data?.id}/feed?pageSize=30`)).t.slice(0,200)};
