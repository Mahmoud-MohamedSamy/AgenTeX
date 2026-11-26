const lids = JSON.parse(fs.readFileSync(RUN + '/out/k03-rsc-leads.json', 'utf8')); const hits = [];
for (const id of lids) { const r = (await api('GET', `/modules/${M.leads}/records/${id}`)).j?.data; const s = JSON.stringify(r || {}); const m = s.match(/"field":"single_line","value":\{"kind":"string","value":"([^"]{1,60})"/) || s.match(/"single_line":"([^"]{1,60})"/); if (m) { const nm = (s.match(/"field":"name","value":\{"kind":"string","value":"([^"]{1,60})"/) || [])[1]; hits.push({ id, name: nm, single_line: m[1] }); if (hits.length >= 3) break; } }
return hits;
