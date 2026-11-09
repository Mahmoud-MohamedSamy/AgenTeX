const o = as(OWNER); const prev = JSON.parse(require('fs').readFileSync('../after/filters.json', 'utf8'));
const created = prev.created; const P = 'QA R2W2 FL'; const day = d => new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);
// the earlier run's prefix includes its own number: read it from a lead name
const g = await o.get(`/modules/${MODS.leads}/records/${created.leads.A}`); const pfx = val(g.j, 'first_name').replace(/ A$/, '');
const views = [];
const run = async (k, nameField, cond, expect) => {
  const v = await o.post(`/modules/${MODS[k]}/views`, { name: 'QA R2W2 FV2 ' + views.length + ' ' + Math.random(), kind: 'list', layout_id: LAY[k], visibility: 'private', settings: { columns: [nameField], sort: null, criteria: { pattern: '1 and 2', conditions: [{ field: nameField, operator: 'starts_with', value: pfx }, cond] }, related_criteria: [] } });
  if (v.s >= 300) return 'VIEW ' + v.s + ' ' + (v.j.error.details || []).map(d => d.message).join('|').slice(0, 120);
  views.push([k, v.j.data.id]);
  const r = await o.get(`/modules/${MODS[k]}/records?page=1&per_page=50&layout_id=${LAY[k]}&view_id=${v.j.data.id}`);
  const ids = (r.j.data || []).map(x => x.id); const map = created[k];
  const got = Object.keys(map).filter(n => ids.includes(map[n])).sort().join('');
  return (got === expect ? 'OK ' : 'WRONG ') + '[' + got + '] expected [' + expect + ']';
};
out.leads = {};
out.leads['company does_not_contain Alpha'] = await run('leads', 'first_name', { field: 'company', operator: 'does_not_contain', value: 'Alpha' }, 'BC');
out.leads['lead_source contains_any_of web,chat'] = await run('leads', 'first_name', { field: 'lead_source', operator: 'contains_any_of', value: ['web', 'chat'] }, 'AB');
out.leads['lead_source contains_none_of web,chat'] = await run('leads', 'first_name', { field: 'lead_source', operator: 'contains_none_of', value: ['web', 'chat'] }, 'C');
out.po = {};
for (const [op, value, exp] of [['equals', 12, 'B'], ['not_equal_to', 12, 'AC'], ['greater_than', 12, 'C'], ['less_than', 12, 'A']]) out.po['tax ' + op] = await run('po', 'name', { field: 'tax', operator: op, value }, exp);
for (const [op, value, exp] of [['is_before', day(0), 'A'], ['is_after', day(0), 'C'], ['is_between', [day(-1), day(1)], 'B'], ['yesterday', null, ''], ['tomorrow', null, ''], ['this_month', null, 'B'], ['is_not_empty', null, 'ABC']]) out.po['due_date ' + op] = await run('po', 'name', { field: 'due_date', operator: op, value }, exp);
for (const [k, id] of views) await o.del(`/modules/${MODS[k]}/views/${id}`);
out.viewsDeleted = views.length; out.today = day(0);
