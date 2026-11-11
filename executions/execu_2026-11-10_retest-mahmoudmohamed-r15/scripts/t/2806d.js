const L='841043e1-c078-41f9-8d6e-dfd61bee45c3';
const r = await api('GET','/modules/'+L+'/fields'); const fs_ = arr(r.j && r.j.data);
log(Object.keys(fs_[0])); const types = {}; fs_.forEach(f => { const k = f.datatypeKey||f.datatype_key||f.data_type||f.type; types[k]=(types[k]||0)+1; }); log(types);
const pl = fs_.filter(f => JSON.stringify(f).includes('pick_list'));
log(JSON.stringify(pl.find(f=>/lead_source/.test(JSON.stringify(f)))||pl[0]).slice(0,1800));
const g = await api('GET','/global-sets'); log('gs', g.s, g.t.slice(0,300));
