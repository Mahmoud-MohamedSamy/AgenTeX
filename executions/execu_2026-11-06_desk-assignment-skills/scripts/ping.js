const r=await api('GET','/notifications?limit=3');return r.s+' n='+arr(r.j&&r.j.data&&(r.j.data.data||r.j.data)).length;
