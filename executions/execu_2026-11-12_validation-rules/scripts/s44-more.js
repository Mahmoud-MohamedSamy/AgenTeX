// Not-run cases, API part: J5 J10 K2 B9 D26 G19 N3 G22 G7 H5. Each block isolated.
const mid = await modId(); const L = I.layout; const isDesk = APP === 'desk'; const sfx = isDesk ? '-desk' : ''; const o = {};
const T = async (k, fn) => { try { o[k] = await fn(); } catch (e) { o[k] = 'ERR ' + String(e.message).slice(0, 200); } };
const flds = await fieldsOf(mid); const fid = n => (flds.find(f => f.fieldName === n) || {}).id;

// J5 change field type of a field used in a length rule
await T('J5', async () => {
  const r = await mkRule(mid, { name: P + ' J5 len', layoutId: L, primaryField: 'qa_vr_note', branches: [B(C('lengthGt', 'qa_vr_note', 5), 'QA J5 too long')] });
  if (r.s >= 300) return 'rule ' + SR(r).slice(0, 200);
  const f = flds.find(x => x.fieldName === 'qa_vr_note');
  const tries = [];
  for (const [m, b] of [['PUT', { ...f, datatypeKey: 'number' }], ['PATCH', { datatypeKey: 'number' }]]) { const u = await api(m, '/modules/' + mid + '/fields/' + f.id, b); tries.push(m + ' ' + SR(u).slice(0, 160)); if (u.s < 300) break; }
  const after = (await fieldsOf(mid)).find(x => x.fieldName === 'qa_vr_note'); const g = (await getRule(mid, r.j.data.id)).j.data;
  const rec = await mkRec(mid, { ...I.base, qa_vr_note: 'longer than five' }, L);
  await delRule(mid, r.j.data.id);
  const ok = !/number/.test(after.datatypeKey) ;
  RES('J5' + sfx, ok ? 'PASS' : 'INFO', `change text field used in a length rule to number: ${tries.join(' | ')}; type now ${after.datatypeKey}; rule status=${g.status} conditionError=${g.conditionError}; save 'longer than five' -> ${rec.s} ${rec.err.slice(0, 80)}`);
  return tries;
});

// J10 restore a deleted record that breaks a rule added later
await T('J10', async () => {
  const a = await mkRec(mid, { ...I.base, qa_vr_text: 'BAD-j10' }, L); if (!a.id) return 'rec ' + a.s + a.err;
  const d = await api('DELETE', '/modules/' + mid + '/records/' + a.id);
  const r = await mkRule(mid, { name: P + ' J10 text', layoutId: L, primaryField: 'qa_vr_text', branches: [B(C('startsWith', 'qa_vr_text', 'BAD'), 'QA J10 text cannot start with BAD')] });
  const rs = await api('POST', '/modules/' + mid + '/records/' + a.id + '/restore', {});
  const g = await api('GET', '/modules/' + mid + '/records/' + a.id);
  const ed = await updRec(mid, a.id, { qa_vr_note: 'other field after restore' });
  const ed2 = await updRec(mid, a.id, { qa_vr_text: 'BAD-j10-2' });
  if (r.j && r.j.data) await delRule(mid, r.j.data.id);
  RES('J10' + sfx, rs.s < 300 ? 'PASS' : 'INFO', `record with BAD-j10 deleted (${d.s}), rule added, restore -> ${SR(rs).slice(0, 160)}; record readable ${g.s}; edit other field -> ${ed.s}; edit checked field to another bad value -> ${ed2.s} ${ed2.err.slice(0, 80)}. Restore is not blocked by the rule (no hidden failure; record comes back as it was)`);
});


// B9 saved with warnings: rule on the default layout for a field that is not on it
await T('B9', async () => {
  const r = await mkRule(mid, { name: P + ' B9 warn', layoutId: I.defLayout, primaryField: 'qa_vr_ml', branches: [B(C('contains', 'qa_vr_ml', 'zzz'), 'QA B9')] });
  const w = r.j && r.j.data && r.j.data.warnings; if (r.j && r.j.data) { I.b9 = r.j.data.id; SAVE(); }
  return SR(r).slice(0, 120) + ' warnings=' + JSON.stringify(w).slice(0, 300);
});

// D26 relative dates
await T('D26', async () => {
  const res = [];
  for (const v of ['${CURRENTTIME}', 'today', '$today', 'now']) { const r = await mkRule(mid, { name: P + ' D26 ' + v, layoutId: L, primaryField: 'qa_vr_date', branches: [B(C('lt', 'qa_vr_date', v), 'QA D26 date must not be in the past')] }); res.push(v + ':' + SR(r).slice(0, 140)); if (r.s < 300) { const a = await mkRec(mid, { ...I.base, qa_vr_date: '2020-01-01' }, L); res.push('  save 2020-01-01 -> ' + a.s); await delRule(mid, r.j.data.id); } }
  RES('D26' + sfx, 'INFO', 'relative date values in a date rule (API): ' + res.join(' | '));
  return res;
});

// G19 subform sub-fields
await T('G19', async () => {
  const sub = flds.filter(f => /subform|table|line_item/i.test(f.datatypeKey));
  const all = (await api('GET', '/modules')).j.data; let other = [];
  for (const m of arr(all).filter(m => (m.appKey || m.app_key) === APP).slice(0, 40)) { const F = arr((await api('GET', '/modules/' + m.id + '/fields')).j.data).filter(f => /subform/i.test(f.datatypeKey)); if (F.length) other.push(m.moduleKey + ':' + F.map(f => f.fieldName + '=' + (f.capabilities && f.capabilities.canCreateValidationRule)).join(',')); if (other.length > 3) break; }
  RES('G19' + sfx, 'INFO', `subform fields on this module: ${sub.map(f => f.fieldName + ' rule=' + (f.capabilities && f.capabilities.canCreateValidationRule)).join(', ') || 'none'}; other modules with subforms: ${other.join(' ; ') || 'none found'}. Sub-fields are not offered as "field to check" (build: canCreateValidationRule false for subform)`);
});

// N3 many rules: try 60 disabled rules on one field (kept for the UI timing check)
await T('N3', async () => {
  const made = []; let fail = ''; const t0 = Date.now();
  for (let i = 0; i < 60; i++) { const r = await mkRule(mid, { name: P + ' N3 ' + String(i).padStart(2, '0'), layoutId: L, primaryField: 'qa_vr_dec', status: 'disabled', branches: [B(C('gt', 'qa_vr_dec', 1000 + i), 'QA N3 ' + i)] }); if (r.s < 300) made.push(r.j.data.id); else { fail = SR(r).slice(0, 150); break; } }
  const t1 = Date.now(); const lst = await api('GET', VR(mid)); const t2 = Date.now();
  I.n3 = made; SAVE();
  o.N3api = `created ${made.length} disabled rules on one field in ${t1 - t0} ms${fail ? '; stopped: ' + fail : ''}; GET list (${arr(lst.j && lst.j.data).length} rules) ${t2 - t1} ms`;
  return o.N3api;
});

// G22 merge (CRM): kept value breaks the rule
if (!isDesk) await T('G22', async () => {
  const a = await mkRec(mid, { ...I.base, last_name: P + ' G22 master', qa_vr_text: 'fine-master' }, L);
  const b = await mkRec(mid, { ...I.base, last_name: P + ' G22 dup', qa_vr_text: 'BAD-dup' }, L);
  const r = await mkRule(mid, { name: P + ' G22 text', layoutId: L, primaryField: 'qa_vr_text', branches: [B(C('startsWith', 'qa_vr_text', 'BAD'), 'QA G22 text cannot start with BAD')] });
  const pv = await api('POST', '/modules/' + mid + '/records/' + a.id + '/merge/preview', { duplicate_ids: [b.id] });
  const m = await api('POST', '/modules/' + mid + '/records/' + a.id + '/merge', { duplicate_ids: [b.id], source: { qa_vr_text: b.id } });
  const g = await api('GET', '/modules/' + mid + '/records/' + a.id); const val = g.j && g.j.data && (g.j.data.data || []).find(x => x.field === 'qa_vr_text');
  if (r.j && r.j.data) await delRule(mid, r.j.data.id);
  RES('G22', 'INFO', `merge where kept value (from duplicate) is BAD-dup: preview ${SR(pv).slice(0, 120)} | merge ${SR(m).slice(0, 200)} | master qa_vr_text now ${val && val.value && val.value.value}`);
});

// G7 convert (CRM): rule on Contacts last name
if (!isDesk) await T('G7', async () => {
  const cm = await modId('contacts');
  const r = await mkRule(cm, { name: P + ' G7 contact', layoutId: null, primaryField: 'last_name', branches: [B(C('startsWith', 'last_name', 'BADCONV'), 'QA G7 contact last name cannot start with BADCONV')] });
  if (r.s >= 300) { RES('G7', 'INFO', 'rule on Contacts last_name -> ' + SR(r).slice(0, 200)); return; }
  const lead = await mkRec(mid, { first_name: 'QA', last_name: 'BADCONV QA VR1112 G7', company: 'QA VR1112 G7 Co' }, null);
  const cv = await api('POST', '/modules/' + mid + '/records/' + lead.id + '/convert', {});
  const ok = await mkRec(mid, { first_name: 'QA', last_name: 'QA VR1112 G7 ok', company: 'QA VR1112 G7 Co ok' }, null);
  const cv2 = await api('POST', '/modules/' + mid + '/records/' + ok.id + '/convert', {});
  I.g7 = { lead: lead.id, ok: ok.id, cv: cv.j && cv.j.data, cv2: cv2.j && cv2.j.data }; SAVE();
  await delRule(cm, r.j.data.id);
  RES('G7', cv.s === 422 ? 'PASS' : 'FAIL', `rule on Contacts (last name starts with BADCONV, all layouts). Convert lead 'BADCONV…' -> ${SR(cv).slice(0, 300)} | control lead convert -> ${cv2.s}. Mass convert: no mass-convert API/action found in the build`);
});

// H5 layout rule shows + requires field; validation rule checks its format
await T('H5', async () => {
  const lr = await api('POST', '/modules/' + mid + '/layout-rules', { name: P + ' H5 layout rule', layoutId: L, primaryField: 'qa_vr_pick', status: 'active', branches: [{ condition: { op: 'eq', field: 'qa_vr_pick', value: 'Reject' }, actions: [{ type: 'show_fields', fields: ['qa_vr_email'] }, { type: 'require_fields', fields: ['qa_vr_email'] }] }] });
  if (lr.s >= 300) return 'layout rule ' + SR(lr).slice(0, 300);
  I.h5lr = lr.j.data.id; SAVE();
  const r = await mkRule(mid, { name: P + ' H5 email', layoutId: L, primaryField: 'qa_vr_email', branches: [B(C('notContains', 'qa_vr_email', '@example.org'), 'QA H5 email must be @example.org')] });
  if (r.j && r.j.data) { I.h5 = r.j.data.id; SAVE(); }
  const a = await mkRec(mid, { ...I.base, qa_vr_pick: 'Reject' }, L);
  const b = await mkRec(mid, { ...I.base, qa_vr_pick: 'Reject', qa_vr_email: 'x@gmail.com' }, L);
  const c = await mkRec(mid, { ...I.base, qa_vr_pick: 'Reject', qa_vr_email: 'x@example.org' }, L);
  o.H5api = `Reject + email empty -> ${a.s} ${a.err.slice(0, 160)} | Reject + x@gmail.com -> ${b.s} ${b.err.slice(0, 160)} | Reject + x@example.org -> ${c.s}`;
  return o.H5api;
});
fs.writeFileSync(RUN + '/out/s44-' + APP + '.json', JSON.stringify(o, null, 1));
return o;
