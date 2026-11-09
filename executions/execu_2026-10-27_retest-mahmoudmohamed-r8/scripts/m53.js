const out = {}; const D = '94e22466-8688-4b6b-aedc-fb141212cc81';
const q = await api('POST', '/reporting/query?limit=100&timezone=Africa%2FCairo', { ir_version: 14, filters: [], sort: [], limit: 100, base_dataset_id: D, dimensions: [{ dataset_id: D, field_key: 'name', grain: null }, { dataset_id: D, field_key: 'qa_rollup', grain: null }], measures: [] }); out.report = q.s + ' ' + q.t.slice(0, 500);
const f = await api('POST', '/files', { file_name: 'probe.txt', content_type: 'text/plain', size: 4, purpose: 'attachment' }); out.filesPost = f.s + ' ' + f.t.slice(0, 160);
return done(out);
