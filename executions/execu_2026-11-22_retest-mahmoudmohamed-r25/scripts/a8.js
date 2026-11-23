const r=await api('GET','/desk/tickets/33dfd714-5b9e-4c51-86f4-f33dd1fe9504/activity?limit=200'); log(r.s, r.j.meta);
for(const x of arr(r.j.data)) if(x.occurred_at>'2026-11-09'&&x.occurred_at<'2026-11-10' || x.occurred_at>'2026-11-21') log(x.occurred_at,x.action,x.source,JSON.stringify(x.summary).slice(0,200));
const d=await api('GET','/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/105927e1-32ea-45a0-97b8-ba4f314d99ce'); const o={};d.j.data.data.forEach(f=>o[f.field]=f.value&&f.value.value); log(o.description.slice(0,1500));
