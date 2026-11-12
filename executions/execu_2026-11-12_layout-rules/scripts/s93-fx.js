const mid = await modId(); const out = {}; const ms = arr((await api('GET', '/modules')).j.data);
const bp = await api('GET', '/modules/' + mid + '/blueprints'); out.bp = arr(bp.j.data).map(b => b.id + ' ' + b.name + ' ' + (b.status || b.state) + ' layout=' + b.layoutId + ' field=' + (b.fieldName || b.field)).slice(0, 8);
out.wf = arr((await api('GET', '/web-forms')).j.data).slice(0, 5).map(w => w.id + ' ' + w.name + ' mod=' + (w.moduleId || w.module_id));
for (const m of ms) { const v = arr((await api('GET', '/modules/' + m.id + '/validation-rules')).j.data); if (v.length) { out.vr = m.moduleKey + ' ' + JSON.stringify(v[0]).slice(0, 1500); break; } }
for (const m of ms) { const b = arr((await api('GET', '/modules/' + m.id + '/buttons')).j.data); if (b.length) { out.btn = m.moduleKey + ' ' + JSON.stringify(b[0]).slice(0, 800); break; } }
for (const m of ms) { const b = arr((await api('GET', '/modules/' + m.id + '/links')).j.data); if (b.length) { out.link = m.moduleKey + ' ' + JSON.stringify(b[0]).slice(0, 800); break; } }
out.conv = JSON.stringify((await api('GET', '/modules/' + mid + '/conversion/config')).j).slice(0, 800);
out.profiles = arr((await api('GET', '/iam/profiles')).j.data).map(p => p.id + ' ' + p.name).slice(0, 30);
return out;
