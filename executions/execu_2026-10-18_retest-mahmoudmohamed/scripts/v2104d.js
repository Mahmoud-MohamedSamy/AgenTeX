// NDC-2104 round 2 (19 Oct): user kept the label "Last Activity" = record modified time. Check that editing a record moves it and the criteria follow.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const V = 'caa66e4f-9c0b-4b1a-9f6e-ba96ac8fac5a'; const out = {};
const nm = r => ((r.data || []).find(f => f.field === 'first_name') || { value: {} }).value.value;
const setCrit = async (conds, cols) => { const g = await api('GET', '/modules/' + L + '/views/' + V);
  const p = await api('PATCH', '/modules/' + L + '/views/' + V, { settings: { ...g.j.data.settings, columns: cols || g.j.data.settings.columns, criteria: { pattern: conds.map((_, i) => i + 1).join(' AND '), conditions: conds } }, row_version: g.j.data.row_version ?? g.j.data.rowVersion });
  return p.s + (p.s >= 300 ? ' ' + p.t.slice(0, 200) : ''); };
const list = async () => { const r = await api('GET', '/modules/' + L + '/records?view_id=' + V + '&page=1&per_page=20'); return arr(r.j && r.j.data).map(x => nm(x) + ' @ ' + x.last_modified_at).sort(); };
const QA = { field: 'first_name', operator: 'starts_with', value: 'QA RT tz' }; const QA2 = { field: 'first_name', operator: 'contains', value: 'RT tz' };
out.patchAll = await setCrit([QA, QA2], ['first_name', 'last_modified_at', 'created_at']); out.all = await list();
out.patchToday = await setCrit([QA, { field: 'last_modified_at', operator: 'today' }]); out.todayBefore = await list();
// Edit L2 through the API (one text field), then re-read.

await setCrit([QA, QA2]); const all = await api('GET', '/modules/' + L + '/records?view_id=' + V + '&page=1&per_page=20');
const l2 = arr(all.j && all.j.data).find(x => nm(x) === 'QA RT tz L2'); out.l2 = l2 && { id: l2.id, lm: l2.last_modified_at, fields: (l2.data || []).map(d => d.field).join(',') };
if (l2) { for (const f of ['description', 'website', 'city', 'phone']) { const p = await api('PATCH', '/modules/' + L + '/records/' + l2.id, { data: [{ field: f, value: { kind: 'string', value: 'QA RT 2104 edit' } }] }); out['edit_' + f] = p.s + ' ' + p.t.slice(0, 160); if (p.s < 300) { out.editedField = f; break; } } }
const g2 = await api('GET', '/modules/' + L + '/records/' + (l2 && l2.id)); out.l2After = g2.j && g2.j.data && g2.j.data.last_modified_at;
out.patchToday2 = await setCrit([QA, { field: 'last_modified_at', operator: 'today' }]); out.todayAfter = await list();
return done(out);
