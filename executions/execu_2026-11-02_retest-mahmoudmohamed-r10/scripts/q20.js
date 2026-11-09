const r=await api('o','GET','/iam/me'); return [r.s, r.t.slice(0,300)];
