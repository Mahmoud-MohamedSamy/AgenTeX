const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
const s = await api('GET', '/search?q=' + encodeURIComponent('A-01') + '&limit=20'); out.search = s.s + ' ' + JSON.stringify(arr(s.j?.data).slice(0, 5).map(x => (x.title || x.name || x.display_name) + ' ' + x.id)).slice(0, 600);
const r = await api('GET', `/modules/${L}/records?page=1&per_page=20&sort_by=created_at&sort_dir=desc`);
out.newest = arr(r.j?.data).slice(0, 8).map(x => { const o = {}; for (const d of x.data || []) o[d.field] = d.value && d.value.value !== undefined ? d.value.value : d.value; return [o.first_name, o.owner, o.created_by, x.id].join(' | '); });
return done(out);
