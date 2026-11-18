const LED = m => fs.appendFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_findings-retest/ledger.md', '- ' + new Date().toISOString().slice(0, 19) + '  [SC RT21] ' + m + '\n');
const IDS = 'D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_findings-retest/out/ids-sc21.json'; const I = JSON.parse(fs.readFileSync(IDS, 'utf8')); const SAVE = () => fs.writeFileSync(IDS, JSON.stringify(I, null, 1));
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const o = { t: new Date().toISOString() }; I.cur = I.cur || {}; I.deals = I.deals || [];
const E = r => r.j && r.j.error ? r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '').slice(0, 300) : null;
const add = async (k, body) => { const r = await api('POST', '/currencies', body); o[k] = [r.s, E(r) || JSON.stringify(r.j && r.j.data).slice(0, 300)]; const id = r.j && r.j.data && r.j.data.id; if (r.s < 300 && id) { I.cur[body.code] = id; SAVE(); LED('currency ' + body.code + ' ' + id + ' added (' + k + ')'); } return r; };
const s = x => ({ kind: 'string', value: String(x) });
const deal = async (name, cur) => { const r = await api('POST', '/modules/' + D + '/records', { data: [{ field: 'deal_name', value: s(name) }, { field: 'currency', value: s(cur) }, { field: 'amount', value: { kind: 'number', value: 1000 } }] }); const id = r.j && r.j.data && (r.j.data.id || r.j.data.recordId); if (r.s < 300 && id) { I.deals.push(id); SAVE(); LED('deal "' + name + '" ' + id + ' (Transactions)'); } return { s: r.s, id, err: E(r) }; };
// C6
await add('C6_notIso_XYZ', { code: 'XYZ', symbol: 'x', exchange_rate: 2, is_active: true });
await add('C6_rate12dp_EUR', { code: 'EUR', symbol: '€', exchange_rate: 0.123456789012, is_active: true });
o.list1 = (await api('GET', '/currencies')).j.data;
// C3: deal in EUR (active in Settings)
o.C3_dealEUR = await deal('QA RT21 SC Deal EUR', 'EUR');
// currency field allowed values
const f = arr((await api('GET', '/modules/' + D + '/fields')).j.data).find(y => (y.apiName || y.api_name || y.key) === 'currency'); o.curField = f && JSON.stringify(f.datatypeOptions || f.datatype_options || f.config || f).slice(0, 500);
return o;
