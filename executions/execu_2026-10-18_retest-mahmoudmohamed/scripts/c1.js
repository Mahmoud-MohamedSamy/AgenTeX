// Cleanup step 1 (owner): delete QA RT views and records, retire the QA RT ap process, restore the owner's Leads list-preferences.
const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out = { views: {}, records: {} };
const tally = (o, k, s) => { o[k] = o[k] || {}; o[k][s] = (o[k][s] || 0) + 1; };
const qaIds = new Set();
for (const [k, m] of [['leads', L], ['deals', D]]) {
  const v = await api('GET', '/modules/' + m + '/views?kind=list'); const vl = arr(v.j && v.j.data && (v.j.data.views || v.j.data)).filter(x => /^QA RT/.test(x.name));
  for (const x of vl) { qaIds.add(x.id); const r = await api('DELETE', '/modules/' + m + '/views/' + x.id); tally(out.views, k, r.s); if (r.s >= 300 && !out.viewErr) out.viewErr = x.name + ' ' + r.s + ' ' + r.t.slice(0, 200); }
}
const recs = { [L]: ['9a20399e-47f4-4cb5-8395-cb842431c8e0', '22d598d7-bc2c-4a01-9e31-87167cde3243', '51cd9fcc-3a39-4ef1-a918-8a7a632236ec', 'af53a145-166a-40b2-8f94-ce56fc69a07f'],
  [D]: ['d802f26e-3cdc-410d-b1ab-735917a64024', 'ab455066-6e34-486a-ae18-819c7dfb3f8f', '077e682d-9b87-4b4f-8eac-108044a74d68'] };
for (const m of [L, D]) for (const id of recs[m]) { const r = await api('DELETE', '/modules/' + m + '/records/' + id); out.records[id.slice(0, 8)] = r.s + (r.s >= 300 ? ' ' + r.t.slice(0, 160) : ''); }
// Approval process "QA RT ap"
const AP = 'e8b3fe71-8e77-4ed3-ab10-2e38df33ddcf';
const g = await api('GET', '/workflow/approval-processes/' + AP); out.apBefore = g.s + ' ' + JSON.stringify(g.j && g.j.data && { status: g.j.data.status, is_active: g.j.data.is_active, active: g.j.data.active, rv: g.j.data.row_version ?? g.j.data.rowVersion }).slice(0, 200);
for (const p of ['/deactivate', '']) { if (p === '/deactivate') { const r = await api('POST', '/workflow/approval-processes/' + AP + '/deactivate'); out.apDeactivate = r.s + ' ' + r.t.slice(0, 160); } }
const del = await api('DELETE', '/workflow/approval-processes/' + AP); out.apDelete = del.s + ' ' + del.t.slice(0, 200);
out.qaViewIds = [...qaIds];
return done(out);
