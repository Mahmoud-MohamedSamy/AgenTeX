const LED = m => fs.appendFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_findings-retest/ledger.md', '- ' + new Date().toISOString().slice(0, 19) + '  [SC RT21] ' + m + '\n');
const IDS = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_findings-retest/out/ids-sc21.json'; const I = JSON.parse(fs.readFileSync(IDS, 'utf8')); const SAVE = () => fs.writeFileSync(IDS, JSON.stringify(I, null, 1));
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const o = { t: new Date().toISOString() };
const E = r => r.j && r.j.error ? r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '').slice(0, 300) : null;
const s = x => ({ kind: 'string', value: String(x) });
const deal = async (name, cur) => { const r = await api('POST', '/modules/' + D + '/records', { data: [{ field: 'deal_name', value: s(name) }, { field: 'currency', value: s(cur) }, { field: 'amount', value: { kind: 'number', value: 1000 } }] }); const id = r.j && r.j.data && (r.j.data.id || r.j.data.recordId); if (r.s < 300 && id) { I.deals.push(id); SAVE(); LED('deal "' + name + '" ' + id + ' (Transactions)'); } return { s: r.s, id, err: E(r) }; };
const rv = async id => { const t = JSON.stringify((await api('GET', '/modules/' + D + '/records/' + id)).j.data); const g = k => { const m = t.match(new RegExp('"' + k + '","value":\{"kind":"[a-z]+","value":"?([^"}]*)')); return m ? m[1] : null; }; return { currency: g('currency'), rate: g('exchange_rate'), amount: g('amount'), amount_home: g('amount_home') }; };
o.C3_dealUSD_beforeAdd = await deal('QA RT21 SC Deal USD pre', 'USD');
const a = await api('POST', '/currencies', { code: 'USD', symbol: '$', exchange_rate: 50, is_active: true }); o.addUSD = [a.s, E(a)]; if (a.s < 300) { I.cur.USD = a.j.data.id; SAVE(); LED('currency USD ' + a.j.data.id + ' added (C5, used by QA RT21 SC deal)'); }
o.C5_deal = await deal('QA RT21 SC Deal USD', 'USD');
if (o.C5_deal.id) { o.dealBefore = await rv(o.C5_deal.id);
  const d = await api('DELETE', '/currencies/' + I.cur.USD); o.C5_deleteWhileUsed = [d.s, d.t.slice(0, 300)]; o.delAt = new Date().toISOString(); if (d.s < 300) { LED('currency USD ' + I.cur.USD + ' DELETED while used by deal ' + o.C5_deal.id + ' (C5 test)'); I.curDeleted = I.cur.USD; delete I.cur.USD; SAVE(); }
  o.dealAfter = await rv(o.C5_deal.id); o.listAfter = (await api('GET', '/currencies')).j.data.currencies.map(c => c.code); }
return o;
