// GET-only probes
const app = process.env.APP || 'crm';
const mods = arr((await api('GET', '/modules')).j?.data);
const m = mods.find(x => x.moduleKey === (app === 'crm' ? 'leads' : 'desk_tickets'));
const L = arr((await api('GET', '/modules/' + m.id + '/layouts')).j?.data);
const lid = L[0].id;
const out = {};
const P = async (k, p) => { const r = await api('GET', p); out[k] = r.s + ' ' + (r.j?.error ? r.j.error.code + ': ' + String(r.j.error.message).slice(0, 120) : JSON.stringify(r.j?.data ?? r.j).slice(0, 300)); };
await P('list?layoutId', '/modules/' + m.id + '/layout-rules?layoutId=' + lid);
await P('list?status=disabled', '/modules/' + m.id + '/layout-rules?status=disabled');
await P('list?status=inactive', '/modules/' + m.id + '/layout-rules?status=inactive');
await P('rule-usage?layoutId', '/modules/' + m.id + '/rule-usage?layoutId=' + lid);
await P('rule-usage?field=status', '/modules/' + m.id + '/rule-usage?field=status');
await P('get bad id', '/modules/' + m.id + '/layout-rules/00000000-0000-0000-0000-000000000000');
await P('get not uuid', '/modules/' + m.id + '/layout-rules/abc');
for (const s of ['order', 'export', 'stats', 'history', 'audit', 'evaluate', 'preview', 'limits']) await P('probe /' + s, '/modules/' + m.id + '/layout-rules/' + s);
await P('probe top /layout-rules', '/layout-rules');
await P('probe /layouts/{id}/layout-rules', '/layouts/' + lid + '/layout-rules');
await P('validation-rules', '/modules/' + m.id + '/validation-rules');
// layout detail keys (does layout carry dependencies / visibility rules?)
const ld = await api('GET', '/modules/' + m.id + '/layouts/' + lid);
out.layoutKeys = Object.keys(ld.j?.data || {}).join(',');
out.layoutDeps = JSON.stringify((ld.j?.data || {}).dependencies || null).slice(0, 300);
// field datatypes and canCreateLayoutRule flags
const F = arr((await api('GET', '/modules/' + m.id + '/fields')).j?.data);
out.fieldCount = F.length;
out.datatypes = [...new Set(F.map(f => f.datatypeKey || f.datatype || f.type))].join(',');
out.fieldSampleKeys = Object.keys(F[0] || {}).join(',');
return out;
