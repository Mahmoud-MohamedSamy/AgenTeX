const D = 'b3e8ce79-d91d-4e47-b141-cfa50097551c';
const dim = k => ({ dataset_id: D, field_key: k, grain: null });
const r = await call('POST', '/reporting/reports', { name: 'QA R2W5 Report 2', folder_id: null, query_spec: { ir_version: 14, base_dataset_id: D, dimensions: [dim('name'), dim('qa_email'), dim('qa_rollup')], measures: [], filters: [], sort: [], limit: 100 }, viz_spec: { report_type: 'tabular', config: {} } });
const id = r.j && r.j.data && (r.j.data.data || r.j.data).id;
const q = id ? await call('POST', `/reporting/reports/${id}/query`, {}) : null;
return { create: r.s + ' ' + r.t.slice(0, 200), id, run: q ? q.s + ' ' + q.t.slice(0, 600) : null };
