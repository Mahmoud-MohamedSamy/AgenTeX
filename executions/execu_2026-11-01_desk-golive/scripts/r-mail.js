const dl = await api('GET', '/desk/departments'); const o = {};
for (const d of arr(dl.j && dl.j.data)) { const r = await api('GET', '/desk/departments/' + d.id); const e = r.j && r.j.data && r.j.data.email_addresses; if (e && e.length) o[d.name] = e.map(x => x.address || x.email || JSON.stringify(x).slice(0, 80)); }
return fin(o);
