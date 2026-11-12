const r=arr2((await api('GET','/workflow/rules?take=500')).j?.data).filter(x=>/C10/.test(x.name));return r.map(x=>x.name+' '+x.id);
