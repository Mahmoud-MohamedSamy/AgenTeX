const out = {}; const L = I.mod_leads; const mods = arr((await api('GET', '/modules')).j.data);
const w = await api('GET', '/workflow/rules/' + I.wf); out.wf = w.s + ' ' + (w.j && w.j.data ? w.j.data.name : '');
const all = arr((await api('GET', '/workflow/rules?module_id=' + L)).j.data); out.wfNames = all.filter(x => /QA/.test(x.name)).map(x => x.name);
out.layouts = {}; for (const m of mods) { const a = arr((await api('GET', '/modules/' + m.id + '/layouts')).j.data).filter(x => /QA LR/.test(x.name)); if (a.length) out.layouts[m.moduleKey] = a.map(x => x.id + ' ' + x.name); }
const r = await api('GET', '/modules/' + L + '/records?layout_id=' + I.layout + '&per_page=50'); out.onLayout = arr(r.j && r.j.data).filter(x => (x.layoutId || x.layout_id) === I.layout).map(x => x.id + ' ' + JSON.stringify(x).slice(0, 250));
out.anyRecShape = arr(r.j && r.j.data)[0] ? Object.keys(arr(r.j.data)[0]).join(',') : '';
return out;
