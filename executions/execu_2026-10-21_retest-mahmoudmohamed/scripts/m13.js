const P = 'e51b6c77-bbf2-4a71-876c-78b99ec8d128';
let d = await api('DELETE', `/modules/${P}?cascade=true`);
let out = { del1: d.s + ' ' + d.t.slice(0, 300) };
if (d.s >= 300) { d = await api('DELETE', `/modules/${P}`); out.del2 = d.s + ' ' + d.t.slice(0, 300); }
out.after = (await api('GET', `/modules/${P}`)).s;
out.listed = arr((await api('GET', '/modules?page=1&page_size=200')).j.data).filter(x => x.moduleKey === 'qa_rt_partners').map(x => x.status);
return done(out);
