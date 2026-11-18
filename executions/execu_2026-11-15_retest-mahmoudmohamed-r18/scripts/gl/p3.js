const o={}; const deps=['19510fdc-91f3-4a7a-8888-153f1318b765','7e1ac409-58b0-41ab-97e1-0e7d5c8c5158'];
for (const d of deps) for (const p of ['/desk/sla/support-plans?department_id='+d,'/desk/sla/support-plans?department_id='+d+'&status=discontinued','/desk/sla/policies?department_id='+d]) { const r=await api('GET',p); o[p]=r.s+' '+JSON.stringify(arr(r.j.data).map(x=>[x.id,x.name,x.status||x.state,x.type,x.is_active])).slice(0,600); }
return o;
