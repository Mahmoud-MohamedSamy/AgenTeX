const r=await api('GET','/desk/email-templates');return r.s+' '+r.t.slice(0,800);
