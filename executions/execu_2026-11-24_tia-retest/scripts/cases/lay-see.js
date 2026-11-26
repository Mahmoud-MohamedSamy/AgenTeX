const a = await api('GET', `/modules/${M.leads}/layouts/accessible`); const l = arr(a.j?.data);
return { s: a.s, n: l.length, names: l.map(x => x.name || x.layoutName || JSON.stringify(x).slice(0, 80)), raw: JSON.stringify(a.j?.data).slice(0, 300) };
