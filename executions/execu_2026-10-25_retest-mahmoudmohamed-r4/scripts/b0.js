// Baseline before round 4: list prefs, modules, teamspaces, Deals layouts, recycle bin size.
const M = { leads: '841043e1-c078-41f9-8d6e-dfd61bee45c3', tasks: 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065', deals: 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', contacts: '6f553963-01d6-4b68-9fb3-143d23044c41' };
const out = { at: new Date().toISOString(), prefs: {} };
for (const [k, id] of Object.entries(M)) { const p = await api('GET', `/modules/${id}/list-preferences`); out.prefs[k] = p.j?.data; }
const mods = await api('GET', '/modules'); out.modules = arr(mods.j?.data).map(m => m.id + ' ' + (m.name || m.moduleKey || m.label));
const ts = await api('GET', '/teamspaces'); out.teamspaces = { s: ts.s, list: arr(ts.j?.data).map(t => t.id + ' ' + t.name) };
const me = await api('GET', '/iam/me'); out.me = { s: me.s, lang: me.j?.data?.language || me.j?.data?.locale, email: me.j?.data?.email };
let n = 0, cur = ''; for (let i = 0; i < 60; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=crm&app_key=iam&app_key=files&app_key=reporting&app_key=workflow&app_key=mail&limit=200${cur ? '&cursor=' + encodeURIComponent(cur) : ''}`); const a = arr(r.j?.data); n += a.length; cur = r.j?.meta?.next_cursor; if (!cur || !a.length) break; } out.recycleBinItems = n;
return done(out);
