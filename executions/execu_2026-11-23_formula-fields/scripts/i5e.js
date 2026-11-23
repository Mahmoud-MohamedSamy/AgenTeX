const DS = '32f179c7-98b8-4e02-ad22-e49517f58cbf';
for (const ag of ['sum', 'SUM', 'Sum']) for (const key of ['aggregation', 'agg', 'function']) {
  const q = await api('POST', '/reporting/query', { query_spec: { ir_version: 14, base_dataset_id: DS, dimensions: [{ dataset_id: DS, field_key: 'fx_d1' }], measures: [{ dataset_id: DS, field_key: 'fx_e7', [key]: ag }], filters: [], sort: [], limit: 50, show_detail_rows: false } });
  if (q.s === 200) { log(key, ag, JSON.stringify(q.j?.data?.data?.rows ?? q.j?.data)); return; } else log(key, ag, q.s, JSON.stringify(q.j?.error?.details || q.j?.errors || q.t).slice(0, 200)); }
