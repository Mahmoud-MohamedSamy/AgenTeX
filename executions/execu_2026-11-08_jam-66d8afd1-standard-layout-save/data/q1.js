const MID = '88e8ea44-1658-4df3-9930-d0902b91073d'; const LID = '1b55c25d-eb27-4046-afd1-b292398b435b';
const S = 'C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/6cad98b2-9d2f-4e48-af44-1193bcd58c1a/scratchpad';
const fs = process.getBuiltinModule('fs');
const o = {};
const names = v => { const L = v && v.layout; if (!L) return null; return (L.sections || []).flatMap(s => (s.columns || []).flatMap(c => (c.fields || []).map(f => f.apiName || f.fieldName))); };
const lay = await api('GET', `/modules/${MID}/layouts/${LID}`); o.layoutStatus = lay.s;
const L = lay.j && lay.j.data; fs.writeFileSync(S + '/standard-layout.json', JSON.stringify(L, null, 1));
o.top = L && Object.keys(L); o.rowVersion = L && L.rowVersion; o.viewKeys = L && L.views && Object.keys(L.views);
for (const k of Object.keys((L && L.views) || {})) { const n = names(L.views[k]); o['view_' + k] = { count: n && n.length, hasResolution: n ? n.includes('resolution') : null, fields: n }; }
const f = await api('GET', `/modules/${MID}/fields`); const F = arr(f.j.data);
fs.writeFileSync(S + '/ticket-fields.json', JSON.stringify(F, null, 1));
o.nonRemovable = F.filter(x => x.isNonRemovable || (x.capabilities && x.capabilities.canRemoveFromLayout === false)).map(x => ({ api: x.apiName, isNonRemovable: x.isNonRemovable, canRemove: x.capabilities && x.capabilities.canRemoveFromLayout, status: x.status, onStandard: (x.layouts || []).filter(l => l.layoutId === LID).map(l => l.views) }));
const r = F.find(x => x.apiName === 'resolution'); o.resolutionField = r && { id: r.id, status: r.status, labels: r.labels, isSystemField: r.isSystemField, isNonRemovable: r.isNonRemovable, isStandardField: r.isStandardField, caps: r.capabilities, layouts: r.layouts, createdAt: r.createdAt, lastModifiedAt: r.lastModifiedAt };
const ls = await api('GET', `/modules/${MID}/layouts`); const LS = arr(ls.j.data);
o.allLayouts = [];
for (const x of LS) { const g = (await api('GET', `/modules/${MID}/layouts/${x.id}`)).j; const d = g && g.data; const row = { name: x.name, id: x.id, isDefault: x.isDefault, lastModified: d && (d.lastModifiedAt || d.updatedAt) }; for (const k of Object.keys((d && d.views) || {})) { const n = names(d.views[k]); row[k] = n ? (n.includes('resolution') ? 'yes' : 'NO') + ' (' + n.length + ')' : 'no layout'; } o.allLayouts.push(row); }
return o;
