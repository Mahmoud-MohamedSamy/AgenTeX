const r=await api('GET','/modules/'+L+'/list-preferences'); return r.s+' '+(r.s>=300?r.t.slice(0,200):'ok');
