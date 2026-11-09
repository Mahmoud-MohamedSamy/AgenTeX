const r=await api('o','GET','/scoring-rules?module_id='+T.LEADS); return r.s+' '+r.t.slice(0,1500);
