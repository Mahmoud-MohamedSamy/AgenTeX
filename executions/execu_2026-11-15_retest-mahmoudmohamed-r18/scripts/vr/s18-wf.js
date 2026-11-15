const forms = arr((await api('GET', '/web-forms')).j.data); const o = {};
for (const f of forms) { const r = await api('POST', '/web-forms/public/' + f.embed_key + '/session', {}); o[f.name + ' (' + f.kind + ', ' + f.app_key + ', enabled=' + f.is_enabled + ')'] = r.s + ' ' + (r.j && r.j.error ? r.j.error.code : ''); }
return o;
