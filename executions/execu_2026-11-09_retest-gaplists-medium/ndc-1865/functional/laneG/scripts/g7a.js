const a=await api('GET','/desk/assignment-rules?type=direct');const b=await api('GET','/iam/me');return {a:a.s+' '+a.t.slice(0,200),me:b.s};
