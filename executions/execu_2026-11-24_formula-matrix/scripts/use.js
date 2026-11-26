// Formula use on the CRM matrix module: list filter + sort per type, import, workflow field update, report. Out: out/use-crm.json
const M = made.mod, LID = made.layout; const res = { filter: [], sort: [], notes: [] };
const T = ['single_line', 'multi_line', 'rich_text', 'email', 'phone', 'url', 'number', 'decimal', 'currency', 'percent', 'long_integer', 'auto_number', 'checkbox', 'pick_list', 'radio_button', 'status', 'multi_select', 'date', 'date_time', 'lookup', 'user', 'address', 'location', 'file_upload', 'camera', 'image_upload', 'map', 'multi_select_lookup', 'department', 'team', 'support_plan', 'email_template', 'subform'];
const all = []; let cur = ''; for (let i = 0; i < 20; i++) { const r = await api('GET', `/modules/${M}/records?limit=100${cur}`); for (const x of L(r.j?.data)) all.push({ id: x.id, v: flat(x.data) }); const n = r.j?.meta?.next_cursor; if (!n) break; cur = '&cursor=' + encodeURIComponent(n); }
res.records = all.length; const byId = Object.fromEntries(all.map(x => [x.id, x.v]));
const q = async (filters, sort) => { const ids = []; let c = ''; for (let i = 0; i < 20; i++) { const r = await api('GET', `/modules/${M}/records?limit=100${filters ? '&filters=' + encodeURIComponent(JSON.stringify(filters)) : ''}${sort ? `&sort_by=${sort[0]}&sort_dir=${sort[1]}` : ''}${c}`); if (r.s >= 300) return { err: E(r).slice(0, 200) }; for (const x of L(r.j?.data)) ids.push(x.id); const n = r.j?.meta?.next_cursor; if (!n) break; c = '&cursor=' + encodeURIComponent(n); } return { ids }; };
const same = (a, b) => a.length === b.length && a.every(x => b.includes(x));
for (const t of T) {
  // boolean formula filter
  const fb = `fx_isblank_${t}`; const exp = all.filter(x => x.v[fb] === false).map(x => x.id); const g = await q([{ field: fb, operator: 'equals', value: false }]);
  res.filter.push({ t, field: fb, op: 'equals false', expected: exp.length, got: g.ids?.length ?? g.err, verdict: g.ids ? (same(g.ids, exp) ? 'PASS' : 'FAIL') : 'ERROR' });
  // number formula filter
  const fn = `fx_len_${t}`; const exp2 = all.filter(x => typeof x.v[fn] === 'number' && x.v[fn] > 3).map(x => x.id); const g2 = await q([{ field: fn, operator: 'greater_than', value: 3 }]);
  res.filter.push({ t, field: fn, op: '> 3', expected: exp2.length, got: g2.ids?.length ?? g2.err, verdict: g2.ids ? (same(g2.ids, exp2) ? 'PASS' : 'FAIL') : 'ERROR' });
  // string formula filter (contains a piece of the filled record's value)
  const fs2 = `fx_upper_${t}`; const sample = all.map(x => x.v[fs2]).find(s => typeof s === 'string' && s.length >= 3);
  if (sample) { const piece = sample.slice(0, 3); const exp3 = all.filter(x => typeof x.v[fs2] === 'string' && x.v[fs2].toLowerCase().includes(piece.toLowerCase())).map(x => x.id); const g3 = await q([{ field: fs2, operator: 'contains', value: piece }]);
    res.filter.push({ t, field: fs2, op: `contains "${piece}"`, expected: exp3.length, got: g3.ids?.length ?? g3.err, verdict: g3.ids ? (same(g3.ids, exp3) ? 'PASS' : 'FAIL') : 'ERROR' }); }
  // sort by number formula
  const so = await q(null, [fn, 'asc']); if (so.ids) { const vals = so.ids.map(id => byId[id]?.[fn]); const nn = vals.filter(x => typeof x === 'number'); const okOrder = nn.every((x, i) => i === 0 || nn[i - 1] <= x);
    res.sort.push({ t, field: fn, values: vals.map(x => x ?? '∅').join(','), verdict: okOrder ? 'PASS' : 'FAIL' }); } else res.sort.push({ t, field: fn, verdict: 'ERROR ' + so.err });
}
// import
const NL = String.fromCharCode(10);
const hdr = ['Name', 'In Single Line', 'In Email', 'In Phone', 'In URL', 'In Number', 'In Decimal', 'In Currency', 'In Percent', 'In Long Integer', 'In Checkbox', 'In Pick List', 'In Radio', 'In Status', 'In Multi Select', 'In Date', 'In Date Time', 'In Lookup'];
const keys = ['name', 'in_single_line', 'in_email', 'in_phone', 'in_url', 'in_number', 'in_decimal', 'in_currency', 'in_percent', 'in_long_integer', 'in_checkbox', 'in_pick_list', 'in_radio_button', 'in_status', 'in_multi_select', 'in_date', 'in_date_time', 'in_lookup'];
const row = ['QA FX Matrix - imported', 'Imported Text', 'imp@example.com', '0100 200 3000', 'https://example.com/imp', '15', '2.75', '99.99', '50', '123456789', 'true', 'Blue', 'A', 'Open', 'A;B', '2026-12-01', '2026-12-01 10:15', 'QA FX Matrix Acc'];
if (!made.importedRec) {
  const fd = new FormData(); fd.append('file', new Blob([hdr.join(',') + NL + row.join(',') + NL], { type: 'text/csv' }), 'qa-fx-matrix-import.csv');
  const upr = await api('POST', `/modules/${M}/import`, fd, { form: true }); const sid = upr.j?.data?.session_id; res.importUpload = E(upr).slice(0, 150);
  if (sid) { const opts = { skip_empty: true, replace_empty: null, notify_email: false, assign_to_user_id: null, trigger_automation: false, assignment_rule_id: null, manual_approval: false, default_tag_ids: [], duplicate_check_module_ids: [] };
    res.importMap = E(await api('PUT', `/modules/${M}/import/${sid}/mapping`, { mode: 'add', match_field_key: null, layout_id: LID, mapping: hdr.map((h, i) => ({ header: h, field: keys[i] })), options: opts })).slice(0, 300);
    res.importValidate = E(await api('POST', `/modules/${M}/import/${sid}/validate`)).slice(0, 300); await api('POST', `/modules/${M}/import/${sid}/execute`);
    let s; for (let i = 0; i < 40; i++) { await sleep(4000); s = await api('GET', `/modules/${M}/import/${sid}`); if (/completed|failed/.test(s.j?.data?.status || '')) break; }
    res.importStatus = s.j?.data?.status + ' created ' + s.j?.data?.created_count + ' failed ' + s.j?.data?.failed_count; led('CRM QA FX Matrix import session ' + sid);
    await sleep(4000); const rr = L((await api('GET', `/modules/${M}/records?limit=20&sort_by=created_at&sort_dir=desc`)).j?.data).find(x => flat(x.data).name === 'QA FX Matrix - imported'); if (rr) { made.importedRec = rr.id; keep(); } } }
if (made.importedRec) { const v = await getRec(M, made.importedRec); fs.writeFileSync(RUN + '/out/recs-crm-import.json', JSON.stringify({ rImport: { id: made.importedRec, values: v } }, null, 1));
  res.importInputs = Object.fromEntries(keys.slice(1).map(k => [k, v[k] ?? null])); }
// workflow field update -> formulas recalculated?
const T0 = kind => ({ kind, fieldName: null, fieldNames: null, fieldMatch: null, dateFieldName: null, offsetSeconds: null, offsetMode: null });
if (!made.wfRule) { const r = await api('POST', '/workflow/rules', { moduleId: M, appKey: 'crm', layoutId: null, departmentIds: [], name: 'QA FX Matrix WF recalc', description: 'formula recalc check 24 Nov', mode: 'Recurring', isActive: true, trigger: T0('RecordCreated'),
  criteria: { kind: 'StringMatch', field: 'name', operator: 'StartsWith', stringValue: 'QA FX Matrix WF', caseInsensitive: false }, actions: [{ type: 'FieldUpdate', order: 0, delaySeconds: 0, fieldUpdates: { in_number: { kind: 'int', intValue: 7 }, in_single_line: { kind: 'string', stringValue: 'wf text' } } }] });
  res.wfRule = E(r).slice(0, 250); if (r.j?.data?.id) { made.wfRule = r.j.data.id; keep(); led('CRM workflow rule QA FX Matrix WF recalc ' + made.wfRule); } }
if (made.wfRule && !made.wfRec) { const r = await api('POST', `/modules/${M}/records`, { layout_id: LID, data: data({ name: 'QA FX Matrix WF record', in_number: 1, in_single_line: 'before' }) }); if (r.j?.data?.id) { made.wfRec = r.j.data.id; keep(); } }
if (made.wfRec) { let v; for (let i = 0; i < 10; i++) { await sleep(3000); v = await getRec(M, made.wfRec); if (v.in_number === 7) break; }
  res.workflow = { in_number: v.in_number, fx_sum_number: v.fx_sum_number, expect_sum: 8, in_single_line: v.in_single_line, fx_upper_single_line: v.fx_upper_single_line, expect_upper: 'WF TEXT', verdict: v.in_number !== 7 ? 'BLOCKED (rule did not run)' : (v.fx_sum_number === 8 && v.fx_upper_single_line === 'WF TEXT' ? 'PASS' : 'FAIL (NDC-3217 formulas not recalculated after workflow update)') }; }
if (made.wfRule) { const cur = (await api('GET', `/workflow/rules/${made.wfRule}`)).j?.data; if (cur?.isActive) res.wfOff = E(await api('PATCH', `/workflow/rules/${made.wfRule}`, { ...cur, isActive: false })).slice(0, 120); }
// report on formula fields
const ds = L((await api('GET', '/reporting/semantic-layer/datasets')).j?.data); const d = ds.find(x => x.module_id === M || x.moduleId === M || /QA FX Matrix$/.test(x.name || x.label || ''));
res.dataset = d ? { id: d.id, name: d.name || d.label } : 'not found (' + ds.length + ' datasets)';
if (d) { const fieldsOf = JSON.stringify(d).match(/fx_[a-z_]+/g) || []; res.datasetFxFields = [...new Set(fieldsOf)].length;
  const rq = await api('POST', '/reporting/query', { query_spec: { ir_version: 14, base_dataset_id: d.id, dimensions: [{ dataset_id: d.id, field_key: 'fx_upper_pick_list' }], measures: [{ dataset_id: d.id, field_key: 'fx_abs_number', aggregation: 'sum' }] } });
  res.report = E(rq).slice(0, 300); res.reportRows = JSON.stringify(rq.j?.data?.rows || rq.j?.data).slice(0, 600);
  const exp = {}; for (const x of all) { const k = x.v.fx_upper_pick_list ?? '(blank)'; exp[k] = (exp[k] || 0) + (x.v.fx_abs_number || 0); } res.reportExpected = exp; }
fs.writeFileSync(RUN + '/out/use-crm.json', JSON.stringify(res, null, 1));
const sum = a => { const c = {}; for (const x of a) c[x.verdict] = (c[x.verdict] || 0) + 1; return c; };
log({ records: res.records, filter: sum(res.filter), sort: sum(res.sort), import: res.importStatus, importMap: res.importMap, workflow: res.workflow, dataset: res.dataset, report: res.report, reportRows: res.reportRows, reportExpected: res.reportExpected });
log('filter fails', res.filter.filter(x => x.verdict !== 'PASS')); log('sort fails', res.sort.filter(x => x.verdict !== 'PASS'));
