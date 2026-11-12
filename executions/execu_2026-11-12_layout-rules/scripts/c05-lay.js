const out = {}; const L = I.mod_leads; let d = await api('DELETE', '/modules/' + L + '/layouts/' + I.layout); out.del = SR(d).slice(0, 200);
if (d.s >= 300) { // find the record that still uses it
  const found = []; for (let pg = 1; pg <= 40 && found.length < 3; pg++) { const r = await api('GET', '/modules/' + L + '/records?per_page=100&page=' + pg); const a = arr(r.j && r.j.data); if (!a.length) break; for (const x of a) if (JSON.stringify(x).includes(I.layout)) found.push(x.id + ' ' + JSON.stringify(x).slice(0, 300)); } out.found = found; }
return out;
