// Desk Agent (Mahmoud Samy): A3 API part + save a ticket without the note it cannot change/see
const OI = JSON.parse(fs.readFileSync(RUN + '/out/ids-desk.json', 'utf8')); const mid = OI.mod_desk_tickets; const L = OI.layout; const o = {};
if (process.env.A3 === '1') {
  const l = await api('GET', '/modules/' + mid + '/validation-rules'); o.list = l.s;
  const c = await api('POST', '/modules/' + mid + '/validation-rules', { name: P + ' A3 agent', layoutId: L, departmentIds: [OI.base.department], primaryField: 'qa_vr_url', kind: 'criteria', mode: 'block', status: 'active', branches: [{ when: null, check: { op: 'eq', field: 'qa_vr_url', value: 'https://a3.x' }, message: { en: 'QA A3', ar: 'QA A3' }, triggerOn: 'match' }] }); o.create = SR(c).slice(0, 120);
  if (c.j && c.j.data) { o.cleanup = (await api('DELETE', '/modules/' + mid + '/validation-rules/' + c.j.data.id)).s; }
  const some = arr(l.j && l.j.data).find(x => String(x.name).startsWith(P)); if (some) { o.put = (await api('PUT', '/modules/' + mid + '/validation-rules/' + some.id, { ...some, description: 'A3 agent edit' })).s; o.del = (await api('DELETE', '/modules/' + mid + '/validation-rules/' + some.id)).s; }
}
const eff = await api('GET', '/modules/' + mid + '/field-permissions/effective'); const m = JSON.stringify(eff.j && eff.j.data).match(/"qa_vr_note":"[a-z_]+"/); o.eff = eff.s + ' ' + (m && m[0]);
const vals = { ...OI.base, subject: P + ' H6 agent ' + (process.env.FPM || '') }; const rec = await api('POST', '/modules/' + mid + '/records', { data: Object.entries(vals).map(([k, v]) => ({ field: k, value: { kind: 'string', value: v } })), layout_id: L });
if (rec.j && rec.j.data) fs.appendFileSync(RUN + '/out/low-recs.txt', 'desk ' + rec.j.data.id + '\n');
o.rec = SR(rec).slice(0, 260); return o;
