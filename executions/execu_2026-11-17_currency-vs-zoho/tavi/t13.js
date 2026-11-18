const L = m => fs.appendFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_currency-vs-zoho/tavi/ledger.md', '- ' + m + '\n');
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const out = {};
const d = await api('DELETE', '/modules/' + D + '/records/96cae089-e8c6-497e-9c50-610a19340d2e'); out.delDeal = d.s; if (d.s < 300) L('CLEANUP deleted deal QA CUR1117 Deal USD (in Recycle Bin)');
for (const id of ['78377dfa-8bb2-487a-9fa3-8be9118188fc', '48f34dfa-63e7-4cf0-a326-eb56ba9899d7']) { const r = await api('DELETE', '/currencies/' + id); out['del_' + id.slice(0, 8)] = r.s; if (r.s < 300) L('CLEANUP deleted currency ' + id); }
out.final = (await api('GET', '/currencies')).j.data;
out.profile = (await api('GET', '/iam/tenant/company-profile')).j.data.currency;
return out;
