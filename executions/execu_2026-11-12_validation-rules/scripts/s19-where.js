// G3 old record that breaks a newer rule; G20/G21 other modules; J9 audit
const mid = await modId(); const L = I.layout; const isDesk = APP === 'desk'; const sfx = isDesk ? '-desk' : '';
// G3: disable R1, create BAD record, re-enable, edit another field
{ const r1 = (await rules(mid)).find(r => r.name === P + ' R1 text');
  await putRule(mid, r1.id, { ...r1, status: 'disabled' });
  const old = await mkRec(mid, { ...I.base, qa_vr_text: 'BAD-old', qa_vr_phone: '+201001234567' }, L);
  const g = (await getRule(mid, r1.id)).j.data; await putRule(mid, r1.id, { ...g, status: 'active' });
  const u = await updRec(mid, old.id, { qa_vr_num: 5 }); const u2 = await updRec(mid, old.id, { qa_vr_text: 'BAD-old2' });
  I.G3rec = old.id; SAVE();
  RES('G3' + sfx, 'INFO', `record saved as BAD-old while rule off (${old.s}); rule back on; edit a DIFFERENT field -> ${SR(u.r).slice(0, 220)}; edit the checked field to another bad value -> ${u2.s}`); }
// G20/G21 another module
{ const key = isDesk ? 'desk_contacts' : 'contacts'; const m2 = await modId(key); const F = await fieldsOf(m2);
  const tf = F.find(f => f.datatypeKey === 'single_line' && f.capabilities && f.capabilities.canCreateValidationRule && /last_name|title|department|description/.test(f.fieldName)) || F.find(f => f.datatypeKey === 'single_line' && f.capabilities && f.capabilities.canCreateValidationRule);
  const body = { name: P + ' G21 other module', layoutId: isDesk ? (arr((await api('GET', '/modules/' + m2 + '/layouts')).j.data).find(x => x.isDefault) || {}).id || null : null, primaryField: tf.fieldName, branches: [B(C('eq', tf.fieldName, 'QA VR1112 G21 BAD'), 'QA G21 other module rule')] };
  const r = await mkRule(m2, body);
  let s = `module ${key}, field ${tf.fieldName}: rule -> ${SR(r).slice(0, 160)}`;
  if (r.s < 300) { const vals = isDesk ? { last_name: P + ' G20', [tf.fieldName]: 'QA VR1112 G21 BAD' } : { last_name: P + ' G21', first_name: 'QA', [tf.fieldName]: 'QA VR1112 G21 BAD' };
    const a = await mkRec(m2, vals); const b = await mkRec(m2, { ...vals, [tf.fieldName]: 'QA VR1112 G21 ok' }); s += ` | bad -> ${a.s} ${a.err.slice(0, 120)} | good -> ${b.s} ${b.err.slice(0, 100)}`; await delRule(m2, r.j.data.id); }
  RES(isDesk ? 'G20' : 'G21', /bad -> 422.*good -> 20/.test(s) ? 'PASS' : 'CHECK', s); }
// J9 audit
{ const q = await api('GET', '/audit/events?entity_type=validation_rule&limit=5'); const q2 = await api('GET', '/audit/events?limit=20');
  const hits = (arr(q2.j && q2.j.data) || []).filter(e => /validation/i.test(JSON.stringify(e))).length;
  RES('J9' + sfx, 'INFO', `audit ?entity_type=validation_rule -> ${q.s} ${q.t.slice(0, 300)} | last 20 events mentioning validation: ${hits}`); }
return 'done';
