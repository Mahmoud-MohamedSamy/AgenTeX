const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const f = await api('GET', `/modules/${D}/fields`);
const fl = arr(f.j.data || f.j).filter(x => /pipeline|stage|probab|revenue|reason|amount|deal_name|closing/i.test((x.apiName||x.key||x.name||'')+(x.label||'')));
const lay = await api('GET', `/modules/${D}/layouts`);
const cands = ['/pipelines', `/modules/${D}/pipelines`, '/crm/pipelines', `/pipelines?module_id=${D}`];
const pr = {}; for (const c of cands) { const r = await api('GET', c); pr[c] = r.s + ' ' + r.t.slice(0, 300); }
return done({ fl: fl.map(x => ({ id: x.id, key: x.apiName||x.key, label: x.label, type: x.dataType||x.type, opts: JSON.stringify(x.options||x.config||'').slice(0,300) })), lay: lay.s + ' ' + lay.t.slice(0, 800), pr });
