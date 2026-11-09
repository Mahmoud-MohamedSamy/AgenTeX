const o = as(OWNER);
const tryOp = async (k, nameField, cond) => { const r = await o.post(`/modules/${MODS[k]}/views`, { name: 'QA R2W2 OP probe ' + Math.random(), kind: 'list', layout_id: LAY[k], visibility: 'private', settings: { columns: [nameField], sort: null, criteria: { pattern: '1', conditions: [cond] }, related_criteria: [] } }); if (r.s < 300) await o.del(`/modules/${MODS[k]}/views/${r.j.data.id}`); return r.s + ' ' + (r.j && r.j.error ? JSON.stringify(r.j.error.details) : ''); };
out.notContains = await tryOp('leads', 'first_name', { field: 'company', operator: 'not_contains', value: 'x' });
out.taxEq = await tryOp('po', 'name', { field: 'tax', operator: 'eq', value: 12 });
for (const op of ['equals', 'not_equal_to', 'greater_than', 'less_than', 'greater_or_equal', 'less_or_equal', 'between']) out['tax ' + op] = await tryOp('po', 'name', { field: 'tax', operator: op, value: op === 'between' ? '6,15' : 12 });
for (const op of ['does_not_contain', 'doesnt_contain']) out['company ' + op] = await tryOp('leads', 'first_name', { field: 'company', operator: op, value: 'x' });
for (const op of ['is', 'is_not', 'contains_any_of', 'contains_none_of', 'equals']) out['source ' + op] = await tryOp('leads', 'first_name', { field: 'lead_source', operator: op, value: op.startsWith('contains') ? ['web', 'chat'] : 'web' });
for (const op of ['before', 'after', 'equals', 'between']) out['due ' + op] = await tryOp('po', 'name', { field: 'due_date', operator: op, value: op === 'between' ? '2026-10-26,2026-10-28' : '2026-10-27' });
