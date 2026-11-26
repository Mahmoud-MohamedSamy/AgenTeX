const M = made.mod; const DS = 'fc93a629-932b-493d-9e24-82735660ff78'; const res = {};
const T = ['single_line', 'multi_line', 'rich_text', 'email', 'phone', 'url', 'number', 'decimal', 'currency', 'percent', 'long_integer', 'auto_number', 'checkbox', 'pick_list', 'radio_button', 'status', 'multi_select', 'date', 'date_time', 'lookup', 'user', 'address', 'location', 'file_upload', 'camera', 'image_upload', 'map', 'multi_select_lookup', 'department', 'team', 'support_plan', 'email_template', 'subform'];
const g = { ir_version: 14, base_dataset_id: DS, dimensions: [{ dataset_id: DS, field_key: 'fx_upper_pick_list' }], measures: [{ dataset_id: DS, field_key: 'fx_abs_number', aggregation: 'sum' }], filters: [], sort: [], limit: 50, show_detail_rows: false };
const q = await api('POST', '/reporting/query', { query_spec: g }); res.grouped = E(q).slice(0, 300); res.groupedData = JSON.stringify(q.j?.data?.data?.rows ?? q.j?.data).slice(0, 900);
const all = []; let cur = ''; for (let i = 0; i < 10; i++) { const r = await api('GET', `/modules/${M}/records?limit=100${cur}`); for (const x of L(r.j?.data)) all.push({ id: x.id, v: flat(x.data) }); const n = r.j?.meta?.next_cursor; if (!n) break; cur = '&cursor=' + encodeURIComponent(n); }
const exp = {}; for (const { v } of all) { const k = v.fx_upper_pick_list ?? null; exp[k] = (exp[k] || 0) + (v.fx_abs_number || 0); } res.expected = exp;
// detail rows: every type's text() and len() formula for all records, compared to the records API
const cols = T.flatMap(t => [`fx_text_${t}`, `fx_len_${t}`, `fx_isblank_${t}`]);
const det = { ir_version: 14, base_dataset_id: DS, dimensions: [{ dataset_id: DS, field_key: 'name' }, ...cols.map(c => ({ dataset_id: DS, field_key: c }))], measures: [], filters: [], sort: [], limit: 100, show_detail_rows: true };
const d = await api('POST', '/reporting/query', { query_spec: det }); res.detail = E(d).slice(0, 300);
const rows = d.j?.data?.data?.rows || []; const colsOut = (d.j?.data?.data?.columns || []).map(c => c.key); res.detailRows = rows.length; res.detailCols = colsOut.length;
const mism = []; const byName = {}; for (const { v } of all) (byName[v.name] ||= []).push(v);
for (const row of rows) { const o = Array.isArray(row) ? Object.fromEntries(colsOut.map((c, i) => [c, row[i]])) : row; const cand = byName[o.name] || []; if (cand.length !== 1) continue; const v = cand[0];
  for (const c of cols) { const a = o[c], b = v[c]; const norm = x => x === null || x === undefined || x === '' ? '' : typeof x === 'boolean' ? String(x) : String(x); if (norm(a) !== norm(b) && !(typeof b === 'number' && Number(a) === b)) mism.push({ rec: o.name, c, report: a, record: b }); } }
res.detailMismatch = mism.length; res.mismatchSample = mism.slice(0, 15);
fs.writeFileSync(RUN + '/out/report.json', JSON.stringify(res, null, 1)); log(res);
