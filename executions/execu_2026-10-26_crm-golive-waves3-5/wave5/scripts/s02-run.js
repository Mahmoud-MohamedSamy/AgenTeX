const R = '392b1cea-f75a-4d44-bb3e-1d3ef42f63c0';
const rr = await call('POST', `/reporting/reports/${R}/query`, {}); const d = rr.j.data.data || rr.j.data;
const rec = (await call('GET', '/modules/df656ed7-da62-4e06-b17b-bb3c83961fde/records/0349775e-918d-4125-8b16-94c3e2df8126')).j.data.data.find(f => f.field === 'qa_w5_rollup_sum');
return { cols: d.columns.map(c => c.key), rowCount: d.rows.length, rows: d.rows.slice(0, 14), recordApiRollupSum: rec && rec.value };
