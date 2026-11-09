const r=await api('o','GET','/timeline/admin/visibility-policy'); return r.s+' '+r.t.slice(0,1500);
