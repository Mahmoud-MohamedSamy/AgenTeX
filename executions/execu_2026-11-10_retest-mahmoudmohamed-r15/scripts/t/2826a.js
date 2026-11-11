const r=await api('GET','/desk/sla/meta'); const d=r.j&&r.j.data; log(r.s, JSON.stringify(d).slice(0,2500));
