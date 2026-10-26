const l = await call('GET', `/modules/${MODS.leads}/views?kind=list&layout_id=bf971461-2edc-45f2-b6e4-6e180aa64288`);
const out = {};
for (const v of l.j.data.views.filter(v => /Shared|CV-51|123|Today/.test(v.name))) { const d = await call('GET', `/modules/${MODS.leads}/views/${v.id}`); out[v.name] = JSON.stringify(d.j.data.settings) + ' shared=' + JSON.stringify(d.j.data.shared_user_ids) + ' ' + JSON.stringify(d.j.data.shared_profile_ids || ''); }
return out;
