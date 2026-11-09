const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const p = (await api('GET', `/modules/${D}/list-preferences`)).j?.data; return done(p);
