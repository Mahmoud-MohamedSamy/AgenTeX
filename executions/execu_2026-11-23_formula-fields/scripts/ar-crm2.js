// CRM assignment rules vs a formula field (follow-up to NDC-3228). Leaves nothing behind: everything made here is deleted at the end.
const mods = L((await api('GET', '/modules')).j?.data); const LEADS = mods.find(m => m.moduleKey === 'leads').id;
const OWNER = '97be04b6-0a08-4883-aa51-e1650b11cab7', SAMY = 'd23fb4e0-248d-41f6-af60-d28885a7007e'; const res = {}; const made2 = { rules: [], recs: [], field: null };
const f = await api('POST', `/modules/${LEADS}/fields`, { fields: [fdef('qa_fx_ar', 'QA FX AR', 'formula', { expression: 'first_name = "qafxar"', return_kind: 'boolean' })] }); res.field = E(f); if (f.s < 300) { made2.field = 'qa_fx_ar'; led('CRM Leads formula qa_fx_ar (AR check)'); }
const rule = (label, condition) => ({ moduleId: LEADS, layoutId: null, name: 'QA FX AR ' + label, description: 'QA FX follow-up NDC-3228 - delete', priority: 10, allowedChannels: ['Api'],
  fallback: { kind: 'LeaveUnassigned', userId: null, poolCriteria: null }, isActive: false,
  entries: [{ condition, target: { kind: 'Category', members: [{ userId: SAMY, order: 0, kind: 'User' }], poolCriteria: null }, availability: { requireOnline: false, requireOnShift: false }, followUpTask: null }] });
const condFormula = { kind: 'Comparison', field: 'qa_fx_ar', operator: 'Equal', value: { kind: 'bool', boolValue: true } };
const condControl = { kind: 'StringMatch', field: 'first_name', operator: 'StartsWith', stringValue: 'qafxctl', caseInsensitive: false, negate: null };
const a = await api('POST', '/workflow/assignment-rules', rule('formula', condFormula)); res.ruleOnFormula = E(a).slice(0, 400); if (a.j?.data?.id) made2.rules.push(a.j.data.id);
const b = await api('POST', '/workflow/assignment-rules', rule('control', condControl)); res.ruleControl = E(b).slice(0, 300); if (b.j?.data?.id) made2.rules.push(b.j.data.id);
// behaviour: switch the formula rule on, create a matching and a non-matching lead
for (const [tag, rr, names] of [['formula', a, ['qafxar', 'qafxno']], ['control', b, ['qafxctl1']]]) if (rr.j?.data?.id) { const id = rr.j.data.id; const cur = (await api('GET', `/workflow/assignment-rules/${id}`)).j?.data;
  const on = await api('PATCH', `/workflow/assignment-rules/${id}`, { ...cur, isActive: true }); res['activate ' + tag] = E(on).slice(0, 200);
  const lay = (await api('GET', `/modules/${LEADS}/layouts`)).j; const ld = Array.isArray(lay.data) ? lay.data : lay.data.layouts; const LL = (ld.find(l => l.isDefault) || ld[0]).id;
  const mine = []; for (const fn of names) { const r = await api('POST', `/modules/${LEADS}/records`, { layout_id: LL, data: data({ first_name: fn, last_name: 'QA FX AR', phone: '0100000' + (fn === 'qafxar' ? '1111' : '2222') }) }); if (r.j?.data?.id) { made2.recs.push(r.j.data.id); mine.push(r.j.data.id); } }
  await sleep(10000);
  res['leads ' + tag] = []; for (const id2 of mine) { const v = await getRec(LEADS, id2); res['leads ' + tag].push({ first_name: v.first_name, qa_fx_ar: v.qa_fx_ar, owner: v.owner === SAMY || v.lead_owner === SAMY || v.record_owner === SAMY ? 'Mahmoud Samy (rule)' : (Object.entries(v).filter(([k]) => /owner/i.test(k)).map(([k, x]) => k + '=' + (x === OWNER ? 'owner' : x)).join(' ')) }); }
  await api('PATCH', `/workflow/assignment-rules/${id}`, { ...cur, isActive: false }); }
// cleanup
const cl = []; for (const id of made2.recs) cl.push('lead ' + (await api('DELETE', `/modules/${LEADS}/records/${id}`)).s);
for (const id of made2.rules) cl.push('rule ' + (await api('DELETE', `/workflow/assignment-rules/${id}`)).s);
if (made2.field) { const fid = L((await api('GET', `/modules/${LEADS}/fields`)).j?.data).find(x => x.fieldName === 'qa_fx_ar')?.id; if (fid) cl.push('field ' + (await api('DELETE', `/modules/${LEADS}/fields/${fid}`)).s); }
let bin = 0, cur = ''; const ids = []; for (let i = 0; i < 40; i++) { const r = await api('GET', `/audit/recycle-bin/items?app_key=crm&app_key=workflow&limit=200${cur}`); for (const it of L(r.j?.data)) if (made2.recs.includes(it.record_id) || /^QA FX AR/.test(it.record_label || '')) ids.push(it.id); const n = r.j?.meta?.next_cursor; if (!n) break; cur = '&cursor=' + encodeURIComponent(n); }
if (ids.length) cl.push('bin ' + (await api('POST', '/audit/recycle-bin/delete', { ids })).s + ' (' + ids.length + ')');
res.cleanup = cl; led('CRM AR check cleanup: ' + cl.join(', '));
fs.writeFileSync(RUN + '/out/crm-ar-check.json', JSON.stringify(res, null, 1)); log(JSON.stringify(res, null, 1));
