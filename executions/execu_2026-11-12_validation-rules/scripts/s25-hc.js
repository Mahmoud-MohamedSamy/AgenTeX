const mid = await modId(); const k = I.hcKey, f = I.hcForm; const CS = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158'; const STD = '1b55c25d-eb27-4046-afd1-b292398b435b';
const uuid = () => globalThis.crypto.randomUUID();
const sub = async (desc, shape) => { const vals = { 'contact.last_name': P + ' HC', email: 'qa.vr1112.hc@example.com', subject: P + ' HC ' + shape, description: desc };
  const bodies = { values: { submission_id: uuid(), values: vals }, fields: { submission_id: uuid(), fields: vals }, data: { submission_id: uuid(), data: vals }, flat: { submission_id: uuid(), ...vals } };
  return api('POST', '/help-center/public/' + k + '/forms/' + f + '/submissions', bodies[shape]); };
const out = {};
// find the body shape with a harmless description first
for (const shape of ['values', 'fields', 'data', 'flat']) { const x = await sub('QA VR1112 harmless', shape); out['shape ' + shape] = x.s + ' ' + x.t.slice(0, 200); if (x.s < 300) { out.shape = shape; break; } }
if (!out.shape) return out;
const r = await mkRule(mid, { name: P + ' G15 HC', layoutId: STD, departmentIds: [CS], applyToHelpCenter: true, primaryField: 'description', branches: [B(C('contains', 'description', 'QAVR1112HCBAD'), 'QA G15 Help Center blocked')] });
out.rule = SR(r).slice(0, 200); if (r.s >= 300) return out; const rid = r.j.data.id; LED('G15 HC rule on Standard ' + rid);
const on = await sub('text QAVR1112HCBAD here', out.shape); out.G15 = on.s + ' ' + on.t.slice(0, 400);
const g = (await getRule(mid, rid)).j.data; await putRule(mid, rid, { ...g, applyToHelpCenter: false });
const off = await sub('text QAVR1112HCBAD here', out.shape); out.G16 = off.s + ' ' + off.t.slice(0, 300);
const agent = await api('POST', '/modules/' + mid + '/records', { data: Object.entries({ subject: P + ' G16 agent', contact_id: I.contact, status: 'Open', department: CS, description: 'agent QAVR1112HCBAD' }).map(([a, b]) => ({ field: a, value: enc(b) })) });
out.G16agent = SR(agent).slice(0, 250); if (agent.j && agent.j.data) { (I.recs = I.recs || []).push([mid, agent.j.data.id]); SAVE(); }
await delRule(mid, rid); LED('G15 HC rule deleted');
RES('G15', /^4\d\d/.test(out.G15) && /QA G15/.test(out.G15) ? 'PASS' : 'FAIL', 'Help Center form submit with breaking description, rule switch ON -> ' + out.G15.slice(0, 300));
RES('G16', /^20\d/.test(out.G16) ? 'PASS' : 'FAIL', 'same submit with switch OFF -> ' + out.G16.slice(0, 200) + ' | agent ticket in same dept/layout -> ' + out.G16agent.slice(0, 160));
return out;
