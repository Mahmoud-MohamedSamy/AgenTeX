const mid = await modId(); const out = {};
const bp = (await api('GET', '/modules/' + mid + '/blueprints/d3897352-83e1-45fc-b51d-c4b76da81043')).j.data; out.bp = JSON.stringify(bp).slice(0, 2500);
const w = (await api('GET', '/web-forms/12df8c8a-ed79-490a-beec-0553eaf6ad42')).j.data; out.wf = JSON.stringify(w).slice(0, 1800);
const ms = arr((await api('GET', '/modules')).j.data); for (const m of ms) { const d = arr((await api('GET', '/modules/' + m.id + '/dependency-maps')).j.data); if (d.length) { out.dm = m.moduleKey + ' ' + JSON.stringify(d[0]).slice(0, 900); break; } }
const p = arr((await api('GET', '/iam/profiles')).j.data); out.pkeys = Object.keys(p[0]).join(','); out.puser = JSON.stringify(p.find(x => x.name === 'User')).slice(0, 400);
return out;
