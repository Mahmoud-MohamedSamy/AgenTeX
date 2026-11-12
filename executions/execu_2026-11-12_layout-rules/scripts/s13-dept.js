const tryG = async p => { const r = await api('GET', p); return r.s + ' ' + JSON.stringify(arr(r.j?.data).slice(0, 8).map(x => ({ id: x.id, name: x.name || x.label }))).slice(0, 600); };
const out = {};
for (const p of ['/departments', '/desk/departments', '/settings/departments']) out[p] = await tryG(p);
const lay = await getLayout(await modId(), I.layout); out.layoutDepts = lay.departmentIds; out.hc = { displayInHelpCenter: lay.displayInHelpCenter, name: lay.helpCenterDisplayName };
const def = await getLayout(await modId(), (arr((await api('GET', '/modules/' + (await modId()) + '/layouts')).j.data).find(x => x.isDefault) || {}).id); out.defDepts = def?.departmentIds; out.defHC = def?.displayInHelpCenter;
for (const p of ['/help-center/settings', '/settings/help-center', '/help-center/portal', '/help-center']) { const r = await api('GET', p); out[p] = r.s + ' ' + (r.t || '').slice(0, 200); }
return out;
