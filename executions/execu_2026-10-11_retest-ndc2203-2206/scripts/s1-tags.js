const out = {}; const T = '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/tags';
for (const n of ['Top Priority', 'Newly Created', 'Recently Edited', 'Field Changed']) { const r = await api('POST', T, { name: n }); out[n] = r.s + ' ' + r.t.slice(0, 300); }
out.list = (await api('GET', T)).j.data.map(x => x.name + '=' + x.id);
return done(out);
