const DB = '4853562a-0b4d-45cb-ba34-9f2118fcd32c';
for (const p of ['/desk/departments/' + DB + '/agents', '/desk/departments/' + DB]) { const r = await api('GET', p); log({ p, s: r.s, t: (r.t || '').replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]+/g, '<email>').slice(0, 700) }); }
