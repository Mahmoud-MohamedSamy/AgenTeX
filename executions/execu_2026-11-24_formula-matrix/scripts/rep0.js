const DS = 'fc93a629-932b-493d-9e24-82735660ff78';
const g = { ir_version: 14, base_dataset_id: DS, dimensions: [{ dataset_id: DS, field_key: 'fx_upper_pick_list' }], measures: [{ dataset_id: DS, field_key: 'fx_abs_number', aggregation: 'sum' }], limit: 50 };
const q = await api('POST', '/reporting/query', { query_spec: g }); log(q.t.slice(0, 1200));
const det = { ir_version: 14, base_dataset_id: DS, dimensions: [{ dataset_id: DS, field_key: 'name' }, { dataset_id: DS, field_key: 'fx_text_number' }], measures: [], filters: [], sort: [], limit: 5, show_detail_rows: true };
const d = await api('POST', '/reporting/query', { query_spec: det }); log(d.t.slice(0, 1500));
