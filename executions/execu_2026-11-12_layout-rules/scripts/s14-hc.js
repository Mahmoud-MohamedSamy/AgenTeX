const out = {};
for (const p of ['/help-centers', '/desk/help-centers', '/help-centers?limit=5']) { const r = await api('GET', p); out[p] = r.s + ' ' + (r.t || '').replace(/"(api_key|token|secret)[^,]*/gi, '').slice(0, 900); }
return out;
