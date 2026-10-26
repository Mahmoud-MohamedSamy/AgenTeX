const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const out = []; for (let p = 1; p < 3; p++) { const r = await api('GET', `/modules/${L}/records?page=${p}&per_page=200&sort=created_at&order=desc`); for (const x of arr(r.j?.data)) { const d = Object.fromEntries((x.data || []).map(e => [e.field, e.value])); const n = d.first_name?.value; if (/QA RT 1554/.test(n || '')) out.push({ id: x.id, n, tags: JSON.stringify(d.tags).slice(0, 300) }); } }
const tg = await api('GET', '/tags?search=qart'); const tg2 = arr(tg.j?.data).map(t => t.id.slice(0, 8) + ' ' + t.name);
return done({ out, tagNames: tg.s + ' ' + JSON.stringify(tg2).slice(0, 300) });
