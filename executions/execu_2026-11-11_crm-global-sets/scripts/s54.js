const l=arr((await api('GET','/global-sets')).j.data); return l.map(x=>x.name+' | fields '+x.field_count+' | by '+x.created_by_name);
