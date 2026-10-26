const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', LS = 'fcba0068-d67f-44f5-8412-cdef9c09e16e';
const pl = await api('GET', `/modules/${D}/pipelines?layout_id=${LS}`); const p = arr(pl.j?.data)[1];
return done({ keys: Object.keys(p), stage0: JSON.stringify(p.stages?.[0]).slice(0, 300) });
