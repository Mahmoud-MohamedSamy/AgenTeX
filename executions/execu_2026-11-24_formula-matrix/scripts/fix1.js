const M = made.mod, LID = made.layout; const res = {};
const mods = L((await api('GET', '/modules')).j?.data); const ACC = mods.find(m => m.moduleKey === 'accounts').id;
const a = await getRec(ACC, made.acc); res.account = { account_name: a.account_name, name: a.name, keys: Object.keys(a).filter(k => /name/i.test(k)) };
const accFields = L((await api('GET', `/modules/${ACC}/fields`)).j?.data).filter(f => /name/i.test(f.fieldName)).map(f => f.fieldName + (f.isDisplayField || f.is_display_field ? '*' : '')); res.accNameFields = accFields;
const NL = String.fromCharCode(10);
const imp = async (hdr, keys, row, tag) => { const fd = new FormData(); fd.append('file', new Blob([hdr.join(',') + NL + row.join(',') + NL], { type: 'text/csv' }), tag + '.csv');
  const up = await api('POST', `/modules/${M}/import`, fd, { form: true }); const sid = up.j?.data?.session_id; if (!sid) return { up: E(up) };
  const opts = { skip_empty: true, replace_empty: null, notify_email: false, assign_to_user_id: null, trigger_automation: false, assignment_rule_id: null, manual_approval: false, default_tag_ids: [], duplicate_check_module_ids: [] };
  await api('PUT', `/modules/${M}/import/${sid}/mapping`, { mode: 'add', match_field_key: null, layout_id: LID, mapping: hdr.map((h, i) => ({ header: h, field: keys[i] })), options: opts });
  await api('POST', `/modules/${M}/import/${sid}/validate`); await api('POST', `/modules/${M}/import/${sid}/execute`);
  let s; for (let i = 0; i < 40; i++) { await sleep(3000); s = await api('GET', `/modules/${M}/import/${sid}`); if (/completed|failed/.test(s.j?.data?.status || '')) break; }
  led('CRM QA FX Matrix import ' + tag + ' ' + sid); return { sid, status: s.j?.data?.status, created: s.j?.data?.created_count, errors: s.j?.data?.errors }; };
const hdr = ['Name', 'In Single Line', 'In Email', 'In Phone', 'In URL', 'In Number', 'In Decimal', 'In Currency', 'In Percent', 'In Long Integer', 'In Checkbox', 'In Pick List', 'In Radio', 'In Status', 'In Multi Select', 'In Date', 'In Date Time'];
const keys = ['name', 'in_single_line', 'in_email', 'in_phone', 'in_url', 'in_number', 'in_decimal', 'in_currency', 'in_percent', 'in_long_integer', 'in_checkbox', 'in_pick_list', 'in_radio_button', 'in_status', 'in_multi_select', 'in_date', 'in_date_time'];
const row = ['QA FX Matrix - imported', 'Imported Text', 'imp@example.com', '0100 200 3000', 'https://example.com/imp', '15', '2.75', '99.99', '50', '123456789', 'true', 'Blue', 'A', 'Open', 'A;B', '2026-12-01', '2026-12-01 10:15'];
if (!made.importedRec) { res.imp1 = await imp(hdr, keys, row, 'qa-fx-matrix-import2'); await sleep(3000);
  const rr = L((await api('GET', `/modules/${M}/records?limit=20&sort_by=created_at&sort_dir=desc`)).j?.data).find(x => flat(x.data).name === 'QA FX Matrix - imported'); if (rr) { made.importedRec = rr.id; keep(); } }
// lookup by name alone, with the exact account label
res.imp2 = await imp(['Name', 'In Lookup'], ['name', 'in_lookup'], ['QA FX Matrix - import lookup', a.account_name || a.name], 'qa-fx-matrix-import-lookup');
await sleep(3000); const r2 = L((await api('GET', `/modules/${M}/records?limit=20&sort_by=created_at&sort_dir=desc`)).j?.data).find(x => flat(x.data).name === 'QA FX Matrix - import lookup'); res.imp2rec = r2 ? { id: r2.id, in_lookup: flat(r2.data).in_lookup } : null;
if (made.importedRec) { const v = await getRec(M, made.importedRec); fs.writeFileSync(RUN + '/out/recs-crm-import.json', JSON.stringify({ rImport: { id: made.importedRec, values: v } }, null, 1)); res.importInputs = Object.fromEntries(keys.slice(1).map(k => [k, v[k] ?? null])); }
// report
const ds = L((await api('GET', '/reporting/semantic-layer/datasets')).j?.data); const d = ds.find(x => x.module_key === 'qa_fx_matrix'); res.dataset = d ? { id: d.id, name: d.display_name, active: d.is_active } : 'none; keys: ' + ds.map(x => x.module_key).join(',');
if (d) { const det = await api('GET', `/reporting/semantic-layer/datasets/${d.id}`); res.dsFields = (JSON.stringify(det.j?.data).match(/"fx_[a-z_]+"/g) || []).length; res.dsInFields = (JSON.stringify(det.j?.data).match(/"in_[a-z_]+"/g) || []).length;
  const rq = await api('POST', '/reporting/query', { query_spec: { ir_version: 14, base_dataset_id: d.id, dimensions: [{ dataset_id: d.id, field_key: 'fx_upper_pick_list' }], measures: [{ dataset_id: d.id, field_key: 'fx_abs_number', aggregation: 'sum' }] } });
  res.report = E(rq).slice(0, 400); res.reportRows = JSON.stringify(rq.j?.data?.rows ?? rq.j?.data).slice(0, 800);
  const all = []; let cur = ''; for (let i = 0; i < 10; i++) { const r = await api('GET', `/modules/${M}/records?limit=100${cur}`); for (const x of L(r.j?.data)) all.push(flat(x.data)); const n = r.j?.meta?.next_cursor; if (!n) break; cur = '&cursor=' + encodeURIComponent(n); }
  const exp = {}; for (const v of all) { const k = v.fx_upper_pick_list ?? '(blank)'; exp[k] = (exp[k] || 0) + (v.fx_abs_number || 0); } res.reportExpected = exp; }
fs.writeFileSync(RUN + '/out/fix1.json', JSON.stringify(res, null, 1)); log(res);
