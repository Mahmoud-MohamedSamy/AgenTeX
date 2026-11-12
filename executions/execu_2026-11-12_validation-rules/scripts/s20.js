const mid = await modId(); const L = I.layout; const r1 = (await rules(mid)).find(r => r.name === P + ' R1 text');
const off = await putRule(mid, r1.id, { ...r1, status: 'disabled' });
const old = await api('POST', '/modules/' + mid + '/records', { data: Object.entries({ ...I.base, qa_vr_text: 'BAD-old', qa_vr_phone: '+201001234567' }).map(([k, v]) => ({ field: k, value: enc(v) })), layout_id: L });
const id = old.j && old.j.data && old.j.data.id; if (id) { (I.recs = I.recs || []).push([mid, id]); SAVE(); }
const g = (await getRule(mid, r1.id)).j.data; await putRule(mid, r1.id, { ...g, status: 'active' });
let u = null, u2 = null; if (id) { u = await updRec(mid, id, { qa_vr_num: 5 }); u2 = await updRec(mid, id, { qa_vr_text: 'BAD-old2' }); }
RES('G3', 'INFO', `rule off (${off.s}); create BAD-old -> ${SR(old).slice(0, 200)}; rule on; edit a DIFFERENT field -> ${u && SR(u.r).slice(0, 200)}; edit checked field to another bad value -> ${u2 && u2.s}`);
const ev = await api('GET', '/audit/events?entity_type=validation_rule&limit=8'); return arr(ev.j.data).map(e => [e.action || e.event_type || e.type, e.entity_label || e.entity_name || '', e.occurred_at].join(' | '));
