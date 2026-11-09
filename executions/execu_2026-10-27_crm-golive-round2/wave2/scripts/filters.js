const o = as(OWNER); const t = Date.now() % 100000; const N = v => ({ kind: 'number', value: v });
const P = `QA R2W2 FL ${t}`; const created = { leads: {}, po: {} }, views = [];
const day = d => { const x = new Date(Date.now() + d * 86400000); return x.toISOString().slice(0, 10); };
const L = [['A', { company: 'Alpha Co', email: 'a.r2w2@example.com', lead_source: 'web' }], ['B', { company: 'Beta Co', email: 'b.r2w2@example.org', lead_source: 'chat' }], ['C', { lead_source: 'referral' }]];
for (const [n, f] of L) { const r = await o.post(`/modules/${MODS.leads}/records`, { layout_id: LAY.leads, data: enc({ first_name: `${P} ${n}`, phone: '0101' + String(4000000 + t + n.charCodeAt(0)).slice(0, 7), single_line_3_9: 'QA R2W2', ...f }) }); created.leads[n] = r.j.data.id; }
const PO = [['A', 5, day(-10)], ['B', 12, day(0)], ['C', 20, day(10)]];
for (const [n, tax, due] of PO) { const r = await o.post(`/modules/${MODS.po}/records`, { layout_id: LAY.po, data: enc({ name: `${P} ${n}`, subject: `${P} ${n}`, tax: N(tax), due_date: due }) }); created.po[n] = r.j.data.id; }
await sleep(3000);
const run = async (k, nameField, cond, expect) => {
  const body = { name: `QA R2W2 FV ${t} ${views.length}`, kind: 'list', layout_id: LAY[k], visibility: 'private', settings: { columns: [nameField], sort: { field: 'created_at', dir: 'desc' }, criteria: { pattern: '1 and 2', conditions: [{ field: nameField, operator: 'starts_with', value: P }, cond] }, related_criteria: [] } };
  const v = await o.post(`/modules/${MODS[k]}/views`, body);
  if (v.s >= 300) return 'VIEW ' + v.s + ' ' + v.t.slice(0, 160);
  views.push([k, v.j.data.id]);
  const r = await o.get(`/modules/${MODS[k]}/records?page=1&per_page=50&layout_id=${LAY[k]}&view_id=${v.j.data.id}`);
  if (r.s >= 300) return 'LIST ' + r.s + ' ' + r.t.slice(0, 160);
  const ids = (r.j.data || []).map(x => x.id); const map = created[k];
  const got = Object.keys(map).filter(n => ids.includes(map[n])).sort().join('');
  return (got === expect ? 'OK ' : 'WRONG ') + 'got [' + got + '] expected [' + expect + ']';
};
out.leads = {};
for (const [op, value, exp] of [['equals', 'Alpha Co', 'A'], ['not_equal_to', 'Alpha Co', 'BC'], ['contains', 'Co', 'AB'], ['not_contains', 'Alpha', 'BC'], ['starts_with', 'Beta', 'B'], ['ends_with', 'Co', 'AB'], ['is_empty', null, 'C'], ['is_not_empty', null, 'AB']])
  out.leads['company ' + op] = await run('leads', 'first_name', { field: 'company', operator: op, value }, exp);
for (const [op, value, exp] of [['ends_with', 'example.org', 'B'], ['contains', 'r2w2', 'AB'], ['is_empty', null, 'C']])
  out.leads['email ' + op] = await run('leads', 'first_name', { field: 'email', operator: op, value }, exp);
for (const [op, value, exp] of [['equals', 'web', 'A'], ['not_equal_to', 'web', 'BC'], ['in', ['web', 'chat'], 'AB'], ['not_in', ['web', 'chat'], 'C']])
  out.leads['lead_source ' + op] = await run('leads', 'first_name', { field: 'lead_source', operator: op, value }, exp);
out.po = {};
for (const [op, value, exp] of [['eq', 12, 'B'], ['neq', 12, 'AC'], ['gt', 12, 'C'], ['gte', 12, 'BC'], ['lt', 12, 'A'], ['lte', 12, 'AB'], ['between', [6, 15], 'B'], ['not_between', [6, 15], 'AC']])
  out.po['tax ' + op] = await run('po', 'name', { field: 'tax', operator: op, value }, exp);
for (const [op, value, exp] of [['before', day(0), 'A'], ['after', day(0), 'C'], ['on_or_before', day(0), 'AB'], ['on_or_after', day(0), 'BC'], ['between', [day(-1), day(1)], 'B'], ['today', null, 'B'], ['last_n_days', 15, 'AB'], ['next_n_days', 15, 'BC'], ['is_empty', null, '']])
  out.po['due_date ' + op] = await run('po', 'name', { field: 'due_date', operator: op, value }, exp);
out.created = created; out.views = views;
for (const [k, id] of views) await o.del(`/modules/${MODS[k]}/views/${id}`);
out.viewsDeleted = views.length;
