const r=await api('GET','/desk/assignment-rules/criteria-fields');const d=(r.j&&r.j.data&&r.j.data.fields)||[];
return {n:d.length,keys:d.map(x=>x.key+'['+x.group+']').join(', ')};
