const r = await api('GET','/desk/departments'); log(r.s, arr(r.j).map(d=>[d.name,d.id,d.is_enabled??d.enabled??d.status]));
