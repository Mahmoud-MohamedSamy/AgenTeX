const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const pl = (await api('GET', `/modules/${D}/pipelines?layout_id=fcba0068-d67f-44f5-8412-cdef9c09e16e`)).j.data.map(p => p.id + ' ' + p.name);
return done({ pl, body: (await txt()).split('Storage Requests')[1]?.slice(0, 800), shot: await shot('1325-04b') });
