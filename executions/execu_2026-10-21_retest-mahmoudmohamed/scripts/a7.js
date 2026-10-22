const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', L = 'fcba0068-d67f-44f5-8412-cdef9c09e16e';
const out = {};
for (const c of [`/modules/${D}/pipelines?layout_id=${L}`, `/modules/${D}/pipelines?layoutId=${L}`, `/modules/${D}/layouts/${L}/pipelines`]) { const r = await api('GET', c); out[c] = r.s + ' ' + r.t.slice(0, 1500); }
const lays = (await api('GET', `/modules/${D}/layouts`)).j.data.map(l => ({ id: l.id, name: l.name, def: l.isDefault ?? l.is_default }));
return done({ out, lays });
