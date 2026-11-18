const L = m => fs.appendFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/tavi/ledger.md', '- ' + m + '\n');
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const out = {};
const a = await api('POST', '/currencies', { code: 'USD', symbol: '$', exchange_rate: 50, is_active: true });
out.addUSD = [a.s, a.j && a.j.data && a.j.data.id]; if (a.s < 300) L('created currency USD id ' + a.j.data.id);
const s = x => ({ kind: 'string', value: String(x) });
const r = await api('POST', '/modules/' + D + '/records', { data: [ { field: 'deal_name', value: s('QA CUR1117 Deal USD') }, { field: 'currency', value: s('USD') }, { field: 'amount', value: { kind: 'number', value: 1000 } } ] });
const id = r.j && r.j.data && (r.j.data.id || r.j.data.recordId); out.deal = [r.s, id, r.j && r.j.error ? r.j.error.message : null];
if (id) { L('created deal QA CUR1117 Deal USD id ' + id); const g = await api('GET', '/modules/' + D + '/records/' + id); const t = JSON.stringify(g.j && g.j.data); out.rec = ['amount', 'currency', 'exchange_rate', 'expected_revenue'].map(x => { const i = t.indexOf('"' + x + '"'); return i < 0 ? x + ': (absent)' : t.slice(i, i + 90); }); out.otherKeys = Object.keys(g.j.data || {}); }
return out;
