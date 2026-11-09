const r=await api('GET','/desk/assignment-rules/criteria-fields');const d=(r.j&&r.j.data&&r.j.data.fields)||[];
return d.filter(x=>/overdue|escalat|layout|department|response/i.test(x.key)).map(x=>x.key+'|'+x.label+'|'+x.type);
