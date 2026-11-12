const mid = await modId(); const out = {}; const t = await api('GET', '/modules/' + mid + '/conversion/targets'); out.targets = JSON.stringify(t.j.data).slice(0, 1500);
return out;
