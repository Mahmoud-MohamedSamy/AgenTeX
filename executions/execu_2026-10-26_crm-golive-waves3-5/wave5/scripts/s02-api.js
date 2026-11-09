const D = '83b752d0-b25b-4a71-9ef8-6e1b05e176bd', R = '392b1cea-f75a-4d44-bb3e-1d3ef42f63c0', out = {};
const q = await call('POST', '/reporting/query?limit=100&timezone=Africa%2FCairo', { ir_version: 14, dimensions: [{ dataset_id: D, field_key: 'qa_w5_pick_list', grain: null }], measures: [{ dataset_id: D, field_key: 'id', agg: 'count' }], filters: [], sort: [], limit: 100, base_dataset_id: D });
out.summary = q.s + ' ' + q.t.slice(0, 500);
const q2 = await call('POST', '/reporting/query?limit=100&timezone=Africa%2FCairo', { ir_version: 14, dimensions: [{ dataset_id: D, field_key: 'name', grain: null }, { dataset_id: D, field_key: 'qa_w5_rollup_sum', grain: null }, { dataset_id: D, field_key: 'qa_w5_formula', grain: null }], measures: [], filters: [], sort: [], limit: 100, base_dataset_id: D });
const rows = (q2.j && q2.j.data && (q2.j.data.data || q2.j.data).rows) || []; out.rollupRows = q2.s + ' ' + JSON.stringify(rows.filter(r => JSON.stringify(r).includes('QA W5 R1'))).slice(0, 300) + ' total rows ' + rows.length;
const rr = await call('POST', `/reporting/reports/${R}/query`, {}); out.savedReportRun = rr.s + ' ' + rr.t.slice(0, 200);
const ex = await call('POST', `/reporting/reports/${R}/export/email`, { format: 'csv', recipients: ['mmohamed@anyware.software'] }); out.exportEmail = ex.s + ' ' + ex.t.slice(0, 250);
return out;
