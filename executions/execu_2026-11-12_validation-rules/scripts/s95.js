const a = await api('GET', '/desk/channels/addresses'); const cs = arr(a.j && a.j.data).find(x => x.department_id === I.base.department); return cs && cs.address;
