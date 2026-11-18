const L = m => fs.appendFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/tavi/ledger.md', '- ' + m + '\n');
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const out = {};
const s = x => ({ kind: 'string', value: String(x) });
const mk = async (name, cur) => {
  const body = { data: [ { field: 'deal_name', value: s(name) }, { field: 'currency', value: s(cur) }, { field: 'amount', value: { kind: 'number', value: 1000 } } ] };
  const r = await api('POST', '/modules/' + D + '/records', body);
  const id = r.j && r.j.data && (r.j.data.id || r.j.data.recordId);
  if (r.s < 300 && id) L('created deal ' + name + ' id ' + id);
  return { s: r.s, id, err: r.j && r.j.error ? r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '').slice(0, 300) : null };
};
out.dealEUR = await mk('QA CUR1117 Deal EUR', 'EUR');
out.dealUSD = await mk('QA CUR1117 Deal USD', 'USD');
if (out.dealUSD.id) { const g = await api('GET', '/modules/' + D + '/records/' + out.dealUSD.id); const t = JSON.stringify(g.j && g.j.data); const k = ['amount', 'currency', 'exchange_rate', 'expected_revenue']; out.usdRec = k.map(x => { const i = t.indexOf('"' + x + '"'); return i < 0 ? x + ': (absent)' : t.slice(i, i + 90); }); out.extraKeys = (t.match(/"(home_[a-z_]+|[a-z_]*base[a-z_]*|converted[a-z_]*)"/g) || []).slice(0, 10); }
return out;
