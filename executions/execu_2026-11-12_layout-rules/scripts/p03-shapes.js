// GET-only: shapes of a pick list field, radio, multi-select, and the default layout (sections/views)
const app = process.env.APP || 'crm';
const mods = arr((await api('GET', '/modules')).j?.data);
const m = mods.find(x => x.moduleKey === (app === 'crm' ? 'leads' : 'desk_tickets'));
const F = arr((await api('GET', '/modules/' + m.id + '/fields')).j?.data);
const pick = k => { const f = F.find(x => x.datatypeKey === k && x.isCustomField); return f ? { fieldName: f.fieldName, datatypeOptions: f.datatypeOptions, config: f.config, labels: f.labels } : null; };
const L = arr((await api('GET', '/modules/' + m.id + '/layouts')).j?.data);
const d = L.find(x => x.isDefault) || L[0];
const lay = (await api('GET', '/modules/' + m.id + '/layouts/' + d.id)).j?.data;
const v = lay.views || {};
const out = { moduleId: m.id, layouts: L.map(x => x.name + (x.isDefault ? ' *' : '') + ' ' + x.id), viewKeys: Object.keys(v) };
for (const k of Object.keys(v)) { const s = v[k]?.layout?.sections || []; out['view_' + k] = { keys: Object.keys(v[k] || {}), layoutKeys: Object.keys(v[k]?.layout || {}), sections: s.length, sec0keys: Object.keys(s[0] || {}), sec0: JSON.stringify(s[0] || {}).slice(0, 700) }; }
out.pick = pick('pick_list'); out.radio = pick('radio_button'); out.ms = pick('multi_select'); out.cb = pick('checkbox');
return out;
