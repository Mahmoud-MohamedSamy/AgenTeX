const mid = await modId(); const out = {};
for (const p of ['/modules/' + mid + '/buttons', '/modules/' + mid + '/links', '/modules/' + mid + '/dependency-maps', '/modules/' + mid + '/validation-rules']) { const r = await api('POST', p, {}); out[p.split('/').pop()] = SR(r).slice(0, 700); }
return out;
