const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', R = '8e8227b2-a494-47e3-a368-4e2880e49c39';
const g = await api('GET', `/modules/${D}/records/${R}`);
return done({ api: g.j.data.data.filter(x => /pipeline|stage|prob/.test(x.field)), head: (await txt()).split('Timeline')[1]?.slice(0, 300), shot: await shot('1302-04-on-pipeline1') });
