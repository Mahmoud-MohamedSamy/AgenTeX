// CRM assignment rules (Import channel): rule on a formula vs control rule on first_name. Deletes everything at the end.
const mods = L((await api('GET', '/modules')).j?.data); const LEADS = mods.find(m => m.moduleKey === 'leads').id;
const OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7', SAMY = 'd23fb4e0-248d-41f6-af60-d28885a7007e'; const res = {}; const made2 = { rules: [], recs: [], field: false };
const f = await api('POST', `/modules/${LEADS}/fields`, { fields: [fdef('qa_fx_ar', 'QA FX AR', 'formula', { expression: 'first_name = "qafxar"', return_kind: 'boolean' })] }); res.field = E(f); made2.field = f.s < 300;
const rule = (label, condition) => ({ moduleId: LEADS, layoutId: null, name: 'QA FX AR ' + label, description: 'QA FX follow-up NDC-3228 - delete', priority: 10, allowedChannels: ['Import'],
  fallback: { kind: 'LeaveUnassigned', userId: null, poolCriteria: null }, isActive: false,
  entries: [{ condition, target: { kind: 'Category', members: [{ userId: SAMY, order: 0, kind: 'User' }], poolCriteria: null }, availability: { requireOnline: false, requireOnShift: false }, followUpTask: null }] });
const a = await api('POST', '/workflow/assignment-rules', rule('formula', { kind: 'Comparison', field: 'qa_fx_ar', operator: 'Equal', value: { kind: 'bool', boolValue: true } }));
const b = await api('POST', '/workflow/assignment-rules', rule('control', { kind: 'StringMatch', field: 'first_name', operator: 'StartsWith', stringValue: 'qafxctl', caseInsensitive: false, negate: null }));
res.ruleOnFormula = E(a).slice(0, 300); res.ruleControl = E(b).slice(0, 300);
const curs = {};
for (const rr of [a, b]) if (rr.j?.data?.id) { const id = rr.j.data.id; made2.rules.push(id); const cur = (await api('GET', `/workflow/assignment-rules/${id}`)).j?.data; curs[id] = cur; res['activate ' + id.slice(0, 8)] = E(await api('PATCH', `/workflow/assignment-rules/${id}`, { ...cur, isActive: true })); }
const lay = (await api('GET', `/modules/${LEADS}/layouts`)).j; const ld = Array.isArray(lay.data) ? lay.data : lay.data.layouts; const LL = (ld.find(l => l.isDefault) || ld[0]).id;
const csv = 'First Name,Last Name,Phone\nqafxar,QA FX AR,01000001111\nqafxno,QA FX AR,01000002222\nqafxctl1,QA FX AR,01000003333\n';
const fd = new FormData(); fd.append('file', new Blob([csv], { type: 'text/csv' }), 'qa-fx-ar.csv');
const up = await api('POST', `/modules/${LEADS}/import`, fd, { form: true }); const sid = up.j?.data?.session_id; res.upload = E(up).slice(0, 150);
if (sid) {
  await api('PUT', `/modules/${LEADS}/import/${sid}/mapping`, { layout_id: LL, mapping: [{ header: 'First Name', field: 'first_name' }, { header: 'Last Name', field: 'last_name' }, { header: 'Phone', field: 'phone' }] });
  res.validate = E(await api('POST', `/modules/${LEADS}/import/${sid}/validate`)).slice(0, 200); res.execute = E(await api('POST', `/modules/${LEADS}/import/${sid}/execute`));
  let st; for (let i = 0; i < 30; i++) { await sleep(4000); st = await api('GET', `/modules/${LEADS}/import/${sid}`); if (/completed|failed/.test(st.j?.data?.status || '')) break; }
  res.importStatus = st.j?.data?.status + ' created ' + st.j?.data?.created_count;
  await sleep(8000);
  const rs = L((await api('GET', `/modules/${LEADS}/records?limit=30&sort_by=created_at&sort_dir=desc`)).j?.data).filter(r => flat(r.data).last_name === 'QA FX AR');
  res.leads = rs.map(r => { made2.recs.push(r.id); const v = flat(r.data); return { first_name: v.first_name, qa_fx_ar: v.qa_fx_ar, owner: Object.entries(v).filter(([k]) => /owner/i.test(k)).map(([k, x]) => k + '=' + (x === SAMY ? 'Mahmoud Samy (rule)' : x === OWNER ? 'owner' : x)).join(' ') }; });
}
for (const [id, cur] of Object.entries(curs)) await api('PATCH', `/workflow/assignment-rules/${id}`, { ...cur, isActive: false });
// cleanup
const cl = []; for (const id of made2.recs) cl.push('lead ' + (await api('DELETE', `/modules/${LEADS}/records/${id}`)).s);
for (const id of made2.rules) cl.push('rule ' + (await api('DELETE', `/workflow/assignment-rules/${id}`)).s);
if (made2.field) { const fid = L((await api('GET', `/modules/${LEADS}/fields`)).j?.data).find(x => x.fieldName === 'qa_fx_ar')?.id; if (fid) cl.push('field ' + (await api('DELETE', `/modules/${LEADS}/fields/${fid}`)).s); }
await sleep(3000); const ids = []; let cur = ''; for (let i = 0; i < 40; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=crm&app_key=workflow&limit=200${cur}`); for (const it of L(r.j?.data)) if (made2.recs.includes(it.record_id) || /^QA FX AR/.test(it.record_label || '') || /^qafx/.test(it.record_label || '')) ids.push(it.id); const n = r.j?.meta?.next_cursor; if (!n) break; cur = '&cursor=' + encodeURIComponent(n); }
if (ids.length) cl.push('bin ' + (await api('POST', '/audit/recycle-bin/delete', { ids })).s + ' (' + ids.length + ')');
res.cleanup = cl; led('CRM AR import check cleanup: ' + cl.join(', '));
fs.writeFileSync(RUN + '/out/crm-ar-check.json', JSON.stringify(res, null, 1)); log(JSON.stringify(res, null, 1));
