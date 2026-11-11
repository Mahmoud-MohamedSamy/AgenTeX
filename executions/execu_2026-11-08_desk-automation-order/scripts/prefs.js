const r=await api('GET','/notifications/preferences/me');return r.s+' '+r.t.replace(/[A-Za-z0-9._%+-]+@[A-Za-z]+\.[A-Za-z.]+/g,'<e>').slice(0,2500);
