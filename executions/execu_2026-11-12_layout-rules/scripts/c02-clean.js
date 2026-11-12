const out = {}; const Q = /QA LR1112|qa_lr/i; const mods = arr((await api('GET', '/modules')).j.data); const gone = []; // [kind,id,label]
const D = async (p, kind, id, label) => { const d = await api('DELETE', p); if (d.s < 300) { gone.push([kind, id, label]); return true; } if (d.s !== 404) log('DEL FAIL', kind, label, SR(d).slice(0, 200)); return false; };
// 1 layout rules (prefix only)
let n = 0; const other = []; for (const m of mods) for (const x of arr((await api('GET', '/modules/' + m.id + '/layout-rules')).j.data)) { if (String(x.name).startsWith(P)) { if (await D('/modules/' + m.id + '/layout-rules/' + x.id, 'rule', x.id, x.name)) n++; } else other.push(m.moduleKey + ':' + x.name); } out.rules = n; out.nonQArules = other;
// 2 workflow rules
n = 0; for (const m of mods) for (const x of arr((await api('GET', '/workflow/rules?module_id=' + m.id)).j.data)) if (Q.test(x.name)) { if (await D('/workflow/rules/' + x.id, 'wf', x.id, x.name)) n++; } out.wf = n;
// 3 module fixtures
const fx = {}; for (const m of mods) for (const k of ['blueprints', 'validation-rules', 'dependency-maps', 'buttons', 'links']) { for (const y of arr(((await api('GET', '/modules/' + m.id + '/' + k)).j || {}).data)) if (Q.test(JSON.stringify(y)) || [I.fx_dm, I.bp].includes(y.id)) { let ok = await D('/modules/' + m.id + '/' + k + '/' + y.id, k, y.id, y.name); if (!ok && k === 'blueprints') { const u = await api('PUT', '/modules/' + m.id + '/blueprints/' + y.id, { ...y, isActive: false }); log('bp deactivate', u.s); ok = await D('/modules/' + m.id + '/blueprints/' + y.id, k, y.id, y.name); } fx[k] = (fx[k] || 0) + (ok ? 1 : 0); } } out.fixtures = fx;
// 4 field permissions
out.fps = []; for (const id of I.fps || []) out.fps.push((await api('DELETE', '/modules/' + I.mod_leads + '/field-permissions/' + id)).s);
// 5 import undo
out.impUndo = I.imp ? (await api('POST', '/modules/' + I.mod_leads + '/import/' + I.imp + '/undo')).s : null;
// 6 records: known ids then sweep every module
let rd = 0; const seen = new Set(); const known = [...(I.recs || [])]; for (const k of ['F9', 'F4', 'G6', 'G2', 'G4', 'G12b', 'bpRec']) if (I[k]) known.push([I.mod_leads, I[k]]);
for (const [mid, id] of known) { if (seen.has(id)) continue; seen.add(id); if (await D('/modules/' + mid + '/records/' + id, 'rec', id, 'known')) rd++; }
const sw = {}; for (const m of mods) for (let p = 0; p < 10; p++) { const it = arr(((await api('GET', '/modules/' + m.id + '/records?q=' + encodeURIComponent('QA LR1112') + '&per_page=100')).j || {}).data).filter(x => JSON.stringify(x).includes('QA LR1112')); if (!it.length) break; let any = 0; for (const x of it) if (await D('/modules/' + m.id + '/records/' + x.id, 'rec', x.id, m.moduleKey)) { any++; sw[m.moduleKey] = (sw[m.moduleKey] || 0) + 1; } if (!any) { out['stuck_' + m.moduleKey] = it.length; break; } }
out.records = { known: rd, swept: sw };
// 7 layouts
n = 0; for (const m of mods) for (const l of arr((await api('GET', '/modules/' + m.id + '/layouts')).j.data)) if (Q.test(l.name) || [I.layout, I.layJ7, I.taskLayout, I.dealLayout].includes(l.id)) { if (await D('/modules/' + m.id + '/layouts/' + l.id, 'layout', l.id, l.name)) n++; } out.layouts = n;
// 8 fields
n = 0; for (const m of mods) for (const f of arr((await api('GET', '/modules/' + m.id + '/fields')).j.data)) if (/^qa_lr/.test(f.fieldName)) { if (await D('/modules/' + m.id + '/fields/' + f.id, 'field', f.id, f.fieldName)) n++; } out.fields = n;
// 9 profile from F26 (should already be gone)
if (I.f26prof) out.prof = (await api('DELETE', '/iam/profiles/' + I.f26prof)).s;
fs.writeFileSync(RUN + '/out/cleanup-crm-gone.json', JSON.stringify(gone)); LED('CLEANUP crm deleted ' + gone.length + ' items (out/cleanup-crm-gone.json)');
return out;
