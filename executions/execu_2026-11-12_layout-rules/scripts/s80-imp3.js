const mid = await modId(); const out = {}; const id = I.imp;
const e = await api('POST', '/modules/' + mid + '/import/' + id + '/execute'); out.exec = SR(e).slice(0, 200);
for (let k = 0; k < 20; k++) { await sleep(3000); const s = await api('GET', '/modules/' + mid + '/import/' + id); const d = s.j && s.j.data; out.status = d && (d.status + ' ' + JSON.stringify(d.counts || d.summary || d.result || '').slice(0, 300)); if (d && /complet|done|fail|error|finished/i.test(d.status)) break; }
return out;
