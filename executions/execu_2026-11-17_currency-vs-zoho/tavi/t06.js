const L = m => fs.appendFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/tavi/ledger.md', '- ' + m + '\n');
const EUR = '78377dfa-8bb2-487a-9fa3-8be9118188fc', D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const out = {};
for (const m of ['PATCH', 'PUT']) { const r = await api(m, '/currencies/' + EUR, { code: 'EUR', symbol: '€', exchange_rate: 50, is_active: true }); out['upd_' + m] = [r.s, r.t.slice(0, 250)]; if (r.s < 300) break; }
const s = x => ({ kind: 'string', value: String(x) });
const mk = async (name, cur) => {
  const body = { data: [ { field: 'deal_name', value: s(name) }, { field: 'currency', value: s(cur) }, { field: 'amount', value: { kind: 'decimal', value: '1000' } } ] };
  const r = await api('POST', '/modules/' + D + '/records', body);
  if (r.s < 300 && r.j && r.j.data && r.j.data.id) L('created deal ' + name + ' id ' + r.j.data.id);
  return [r.s, r.j && r.j.error ? r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '').slice(0, 300) : (r.j && r.j.data && r.j.data.id)];
};
out.dealEUR = await mk('QA CUR1117 Deal EUR', 'EUR');
out.dealUSD = await mk('QA CUR1117 Deal USD', 'USD');
return out;
