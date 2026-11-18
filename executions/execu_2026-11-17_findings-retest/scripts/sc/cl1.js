const LED = m => fs.appendFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_findings-retest/ledger.md', '- ' + new Date().toISOString().slice(0, 19) + '  [SC RT21] ' + m + '\n');
const I = JSON.parse(fs.readFileSync('D:/Software Testing/Automation/Agentex Installation/Agentex Installation/executions/execu_2026-11-17_findings-retest/out/ids-sc21.json', 'utf8'));
const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const o = {};
for (const id of I.deals) { const r = await api('DELETE', '/modules/' + D + '/records/' + id); o['deal_' + id.slice(0, 8)] = r.s; if (r.s < 300) LED('CLEANUP deal ' + id + ' deleted (' + r.s + ')'); }
for (const [c, id] of Object.entries(I.cur)) { const r = await api('DELETE', '/currencies/' + id); o['cur_' + c] = r.s; if (r.s < 300) LED('CLEANUP currency ' + c + ' ' + id + ' deleted (' + r.s + ')'); }
o.cur = (await api('GET', '/currencies')).j.data;
const rb = await api('GET', '/audit/recycle-bin/items?app_key=crm&q=QA%20RT21%20SC'); const items = arr(rb.j && rb.j.data); o.rb = items.map(x => [x.id, x.display_name || x.name || x.label || x.record_label]).slice(0, 10);
const ids = items.filter(x => /QA RT21 SC Deal/.test(JSON.stringify(x))).map(x => x.id);
if (ids.length) { const p = await api('POST', '/audit/recycle-bin/delete', { ids }); o.purge = [p.s, p.t.slice(0, 200)]; if (p.s < 300) LED('CLEANUP purged from Recycle Bin (crm): ' + ids.join(', ')); }
o.rbAfter = arr((await api('GET', '/audit/recycle-bin/items?app_key=crm&q=QA%20RT21%20SC%20Deal')).j.data).length;
return o;
